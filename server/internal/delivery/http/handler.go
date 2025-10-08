package http

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"net/url"
	"os"
	"regexp"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"

	"github.com/ItsXomyak/internal/domain"
	"github.com/ItsXomyak/internal/usecase"
)

const (
	stateCookieName     = "twitter_state"
	verifierCookieName  = "twitter_verifier"
	sessionCookieName   = "user_session"
	cookieMaxAgeSeconds = 3600 // 1 час
)

var (
	discordUsernameRegex = regexp.MustCompile(`^[a-zA-Z0-9_.]{2,32}$`)
	walletAddressRegex   = regexp.MustCompile(`^0x[a-fA-F0-9]{40}$`) // Ethereum адрес
)

type Handler struct {
	authService *usecase.AuthService
	raffleService *usecase.RaffleService
}

func NewHandler(authService *usecase.AuthService, raffleService *usecase.RaffleService) *Handler {
	return &Handler{authService: authService, raffleService: raffleService}
}

func (h *Handler) TwitterLogin(c *gin.Context) {
	authURL, state, verifier := h.authService.GenerateAuthURL()

	c.SetCookie(stateCookieName, state, cookieMaxAgeSeconds, "/", "", false, true)
	c.SetCookie(verifierCookieName, verifier, cookieMaxAgeSeconds, "/", "", false, true)

	c.Redirect(http.StatusTemporaryRedirect, authURL)
}

func (h *Handler) TwitterCallback(c *gin.Context) {
	queryState := c.Query("state")
	code := c.Query("code")

	cookieState, err := c.Cookie(stateCookieName)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "state cookie not found"})
		return
	}

	verifier, err := c.Cookie(verifierCookieName)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "verifier cookie not found"})
		return 
	}

	c.SetCookie(stateCookieName, "", -1, "/", "", false, true)
	c.SetCookie(verifierCookieName, "", -1, "/", "", false, true)

	if queryState != cookieState {
		c.JSON(http.StatusBadRequest, gin.H{"error": "state mismatch"})
		return
	}

	result, err := h.authService.ProcessCallback(c.Request.Context(), code, verifier)
	if err != nil {
		if errors.Is(err, usecase.ErrAccountTooNew) {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to process twitter callback", "details": err.Error()})
		return
	}

	sessionData, err := json.Marshal(result)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to marshal session data", "details": err.Error()})
		return
	}


	frontendURLStr := os.Getenv("FRONTEND_URL")
	if frontendURLStr == "" {
		log.Println("ERROR: FRONTEND_URL environment variable is not set")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server configuration error"})
		return
	}

	parsedURL, err := url.Parse(frontendURLStr)
	if err != nil {
		log.Printf("ERROR: Invalid FRONTEND_URL: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server configuration error"})
		return
	}

	cookieDomain := parsedURL.Hostname()
	isSecure := true

	// Для production-доменов (не localhost) мы хотим, чтобы cookie был доступен
	// для всех поддоменов. Например, для 'www.monicorns.xyz' домен cookie
	// должен быть '.monicorns.xyz'.
	if cookieDomain != "localhost" {
		if strings.HasPrefix(cookieDomain, "www.") {
			cookieDomain = strings.TrimPrefix(cookieDomain, "www.")
		}
		cookieDomain = "." + cookieDomain // -> .monicorns.xyz
	} else {
		isSecure = false 
	}

	c.SetCookie(
		sessionCookieName,   
		string(sessionData), 
		cookieMaxAgeSeconds,
		"/",                 
		cookieDomain,        
		isSecure,            
		true,               
	)


	c.Redirect(http.StatusTemporaryRedirect, frontendURLStr)
}

func (h *Handler) AuthStatus(c *gin.Context) {
	sessionCookie, err := c.Cookie(sessionCookieName)
	if err != nil {
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	if sessionCookie == "" {
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	var sessionData usecase.TwitterAuthResult
	if err := json.Unmarshal([]byte(sessionCookie), &sessionData); err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "failed to parse session"})
		return
	}

	c.JSON(http.StatusOK, sessionData)
}

func (h *Handler) RegisterForRaffle(c *gin.Context) {
	sessionCookie, err := c.Cookie(sessionCookieName)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user not authenticated"})
		return
	}

	var sessionData usecase.TwitterAuthResult 
	if err := json.Unmarshal([]byte(sessionCookie), &sessionData); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to parse session"})
		return
	}

	var form domain.RegistrationForm
	if err := c.ShouldBindJSON(&form); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var validationErrors []string

	if form.DiscordUsername == "" {
		validationErrors = append(validationErrors, "discord username is required")
	} else if len(form.DiscordUsername) < 2 || len(form.DiscordUsername) > 32 {
		validationErrors = append(validationErrors, "discord username must be 2-32 characters long")
	} else if !regexp.MustCompile(`^[a-zA-Z0-9_.]+$`).MatchString(form.DiscordUsername) {
		validationErrors = append(validationErrors, "discord username can only contain letters, numbers, dots and underscores")
	}

	if form.WalletAddress == "" {
		validationErrors = append(validationErrors, "wallet address is required")
	} else if !regexp.MustCompile(`^0x[a-fA-F0-9]{40}$`).MatchString(form.WalletAddress) {
		validationErrors = append(validationErrors, "invalid ethereum wallet address format")
	}

	if len(validationErrors) > 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "validation failed",
			"details": validationErrors,
		})
		return
	}

	userToRegister := domain.User{
		TwitterID:        sessionData.TwitterID,
		TwitterUsername:  sessionData.TwitterUsername,
		TwitterCreatedAt: sessionData.TwitterCreatedAt,
		DiscordUsername:  form.DiscordUsername,
		WalletAddress:    form.WalletAddress,
	}

	if err := h.raffleService.RegisterUser(c.Request.Context(), &userToRegister); err != nil {
		if errors.Is(err, domain.ErrUserAlreadyExists) {
			c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to register user", "details": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "user registered successfully"})
}

func (h *Handler) ListParticipants(c *gin.Context) {
	users, err := h.raffleService.ListAllUsers(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to retrieve participants", "details": err.Error()})
		return
	}
	c.JSON(http.StatusOK, users)
}

func (h *Handler) TruncateUsers(c *gin.Context) {
	if err := h.raffleService.TruncateUsers(c.Request.Context()); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to truncate users", "details": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "users truncated successfully"})
}

func (h *Handler) TruncateWinners(c *gin.Context) {
	if err := h.raffleService.TruncateWinners(c.Request.Context()); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to truncate winners", "details": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "winners truncated successfully"})
}

func (h *Handler) SelectWinners(c *gin.Context) {
	type selectWinnersRequest struct {
		Limit int `json:"limit" binding:"required,gt=0"` // gt=0 означает "больше чем 0"
	}

	var req selectWinnersRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body", "details": err.Error()})
		return
	}

	winners, err := h.raffleService.SelectAndPromoteWinners(c.Request.Context(), req.Limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to select winners", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, winners)
}

func (h *Handler) ListWinners(c *gin.Context) {
	winners, err := h.raffleService.ListAllWinners(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to retrieve winners", "details": err.Error()})
		return
	}
	c.JSON(http.StatusOK, winners)
}

func (h *Handler) DeleteUserByID(c *gin.Context) {
	idStr := c.Param("id")

	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format, must be a number"})
		return
	}

	err = h.raffleService.DeleteUserByID(c.Request.Context(), id)
	if err != nil {
		if errors.Is(err, domain.ErrUserNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete user", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}

func (h *Handler) DeleteWinnerByID(c *gin.Context) {
	idStr := c.Param("id")

	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format, must be a number"})
		return
	}

	err = h.raffleService.DeleteWinnerByID(c.Request.Context(), id)
	if err != nil {
		if errors.Is(err, domain.ErrUserNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete winner", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Winner deleted successfully"})
}

func (h *Handler) ListPublicWinners(c *gin.Context) {
	winners, err := h.raffleService.ListPublicWinners(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to retrieve public winners", "details": err.Error()})
		return
	}
	c.JSON(http.StatusOK, winners)
}