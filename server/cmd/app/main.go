package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"github.com/ItsXomyak/internal/config"
	httpHandler "github.com/ItsXomyak/internal/delivery/http"
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

	authService := usecase.NewAuthService(twitterClient)
	raffleService := usecase.NewRaffleService(userRepo, winnerRepo)

	handler := httpHandler.NewHandler(authService, raffleService)

	router := gin.Default()

	config := cors.DefaultConfig()
	config.AllowOrigins = []string{Cfg.FrontendURL}
	config.AllowCredentials = true
	router.Use(cors.New(config))

	httpHandler.RegisterRoutes(router, handler, Cfg.AdminToken, Cfg.SessionSecret)


	srv := &http.Server{
		Addr:         ":" + Cfg.ServerPort,
		Handler:      router,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	go func() {
		log.Printf("Server is running on port %s", Cfg.ServerPort)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("failed to start server: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down server...")

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		log.Printf("Server forced to shutdown: %v", err)
	} else {
		log.Println("Server exited gracefully")
	}

	log.Println("Closing database connection...")
	pg.Pool.Close()

	log.Println("All resources cleaned up successfully")
}