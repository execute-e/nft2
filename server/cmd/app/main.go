package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

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
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("failed to load config: %v", err)
	}

	ctx := context.Background()
	logger.Init(cfg.LogLevel)
	
	pgConfig := &postgres.Config{
		MaxPoolSize:  20,
		ConnAttempts: 5,
		ConnTimeout:  5 * time.Second,
	}
		pg, err := postgres.New(ctx, cfg.DB.DSN, pgConfig)
		if err != nil {
			log.Fatalf("failed to connect to postgres: %v", err)
			}

		defer pg.Pool.Close()
		logger.Info("connected to postgres")

		userRepo := repository.NewUserRepository(pg.Pool)
		winnerRepo := repository.NewWinnerRepository(pg.Pool)

		twitterClient := twitter.NewClient(cfg.Twitter.APIKey, cfg.Twitter.APISecret, cfg.CallbackURL)

		authService := usecase.NewAuthService( twitterClient)
		raffleService := usecase.NewRaffleService(userRepo, winnerRepo)

		handler := http.NewHandler(authService, raffleService)
		

		router := gin.Default()

		http.RegisterRoutes(router, handler, cfg.AdminToken, cfg.SessionSecret)

		log.Printf("Server is running on port %s", cfg.ServerPort)
		
		go func() {
			if err := router.Run(":" + cfg.ServerPort); err != nil {
				log.Fatalf("failed to start server: %v", err)
			}
		}()

		quit := make(chan os.Signal, 1)
		signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
		<-quit

		log.Println("Shutting down server...")

		// TODO: add graceful shutdown

}