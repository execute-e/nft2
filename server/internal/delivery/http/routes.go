package http

import (
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.Engine, h *Handler, adminToken, sessionSecret string) {
	// Сессии
	store := cookie.NewStore([]byte(sessionSecret))
	router.Use(sessions.Sessions("mysession", store))

	authGroup := router.Group("/auth/twitter")
	{
		authGroup.GET("/login", h.TwitterLogin)
		authGroup.GET("/callback", h.TwitterCallback)
	}

	raffleGroup := router.Group("/raffle")
	{
		raffleGroup.POST("/register", h.RegisterForRaffle)
		// middleware только к этому эндпоинту 
		raffleGroup.GET("/list", AdminAuth(adminToken), h.ListParticipants)
	}
}