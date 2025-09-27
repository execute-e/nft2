package http

import (
	"encoding/json"
	"errors"
	"net/http"

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
	}

	verifier, err := c.Cookie(verifierCookieName)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "verifier cookie not found"})
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
	c.SetCookie(sessionCookieName, string(sessionData), cookieMaxAgeSeconds, "/", "", false, true)
	c.JSON(http.StatusOK, gin.H{"message": "success"})
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

	user := domain.User{
		TwitterID:        sessionData.TwitterID,
		TwitterUsername:  sessionData.TwitterUsername,
		TwitterCreatedAt: sessionData.TwitterCreatedAt,
		DiscordUsername:  form.DiscordUsername,
		WalletAddress:    form.WalletAddress,
	}

	if err := h.raffleService.RegisterUser(c.Request.Context(), &user); err != nil {
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