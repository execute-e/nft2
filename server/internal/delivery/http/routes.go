package http

import (
	"embed"
	"io/fs"
	"log"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
)

//go:embed static/admin/*
var adminFS embed.FS

func RegisterRoutes(router *gin.Engine, h *Handler, adminToken, sessionSecret string) {
	// Сессии
	store := cookie.NewStore([]byte(sessionSecret))
	router.Use(sessions.Sessions("mysession", store))

	adminPanelGroup := router.Group("/admin-panel", BasicAuth())
	{
		subFS, err := fs.Sub(adminFS, "static/admin")
		if err != nil {
			log.Fatal("failed to create subFS for admin panel:", err)
		}
		adminPanelGroup.StaticFS("/", http.FS(subFS))
	}

	authGroup := router.Group("/auth/twitter")
	{
		authGroup.GET("/login", h.TwitterLogin) // GET /auth/twitter/login
		authGroup.GET("/callback", h.TwitterCallback) // GET /auth/twitter/callback
		authGroup.GET("/status", h.AuthStatus)	// GET /auth/twitter/status
	}

	waitlistGroup := router.Group("/waitlist")
	{
		waitlistGroup.POST("/register", h.WaitlistRegister)	 // POST /waitlist/register

	}
	
	raffleGroup := router.Group("/raffle")
	{
		raffleGroup.POST("/register", h.RegisterForRaffle) // POST /raffle/register
		raffleGroup.GET("/winners", h.ListPublicWinners) // GET /raffle/winners
	}

	adminGroup := router.Group("/admin", AdminAuth(adminToken))
	{
		adminGroup.GET("/participants", h.ListParticipants) // GET /admin/participants
		adminGroup.DELETE("/participants", h.TruncateUsers)  // DELETE /admin/participants
		adminGroup.DELETE("/participants/:id", h.DeleteUserByID) // DELETE /admin/participants/:id

		adminGroup.GET("/waitlist", h.ListWaitlistEntries) // GET /admin/waitlist
		adminGroup.DELETE("/waitlist", h.TruncateWaitlist)  // DELETE /admin/waitlist
		adminGroup.DELETE("/waitlist/:id", h.DeleteWaitlistEntryByID) // DELETE /admin/waitlist/:id

		adminGroup.POST("/winners", h.SelectWinners)      // POST /admin/winners
		adminGroup.DELETE("/winners", h.TruncateWinners)    // DELETE /admin/winners
		adminGroup.GET("/winners", h.ListWinners)          // GET /admin/winners
		adminGroup.DELETE("/winners/:id", h.DeleteWinnerByID) // DELETE /admin/winners/:id
	}
}