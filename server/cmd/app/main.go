package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"github.com/ItsXomyak/internal/config"
	"github.com/ItsXomyak/internal/delivery/http"
	"github.com/ItsXomyak/internal/repository"
	"github.com/ItsXomyak/internal/usecase"
	"github.com/ItsXomyak/pkg/logger"
	"github.com/ItsXomyak/pkg/postgres"
	"github.com/ItsXomyak/pkg/twitter"
)

func main() {
	Cfg, err := config.Load()
	if err != nil {
		log.Fatalf("failed to load config: %v", err)
	}

	ctx := context.Background()
	logger.Init(Cfg.LogLevel)
	
	pgConfig := &postgres.Config{
		MaxPoolSize:  20,
		ConnAttempts: 5,
		ConnTimeout:  5 * time.Second,
	}
		pg, err := postgres.New(ctx, Cfg.DB.DSN, pgConfig)
		if err != nil {
			log.Fatalf("failed to connect to postgres: %v", err)
			}

		defer pg.Pool.Close()
		logger.Info("connected to postgres")

		userRepo := repository.NewUserRepository(pg.Pool)
		winnerRepo := repository.NewWinnerRepository(pg.Pool)

		twitterClient := twitter.NewClient(Cfg.Twitter.APIKey, Cfg.Twitter.APISecret, Cfg.CallbackURL)

		authService := usecase.NewAuthService( twitterClient)
		raffleService := usecase.NewRaffleService(userRepo, winnerRepo)

		handler := http.NewHandler(authService, raffleService)
		
		router := gin.Default()

		config := cors.DefaultConfig()
    config.AllowOrigins = []string{Cfg.FrontendURL}
    config.AllowCredentials = true 
    router.Use(cors.New(config))

		http.RegisterRoutes(router, handler, Cfg.AdminToken, Cfg.SessionSecret)

		log.Printf("Server is running on port %s", Cfg.ServerPort)
		
		go func() {
			if err := router.Run(":" + Cfg.ServerPort); err != nil {
				log.Fatalf("failed to start server: %v", err)
			}
		}()

		quit := make(chan os.Signal, 1)
		signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
		<-quit

		log.Println("Shutting down server...")

		// TODO: add graceful shutdown

}