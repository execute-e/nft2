package cmd

import (
	"context"
	"os"
	"time"

	"github.com/ItsXomyak/internal/repository"
	"github.com/ItsXomyak/pkg/logger"
	"github.com/ItsXomyak/pkg/postgres"
)

func Run() {
	ctx := context.Background()
	logger.Init(os.Getenv("APP_ENV"))
	
	pgConfig := &postgres.Config{
		MaxPoolSize:  20,
		ConnAttempts: 5,
		ConnTimeout:  5 * time.Second,
	}
		pg, err := postgres.New(ctx, os.Getenv("DATABASE_DSN"), pgConfig)
		if err != nil {
			logger.Error("failed to connect to postgres", "error", err)
			os.Exit(1)
			}

		defer pg.Pool.Close()
		logger.Info("connected to postgres")

		userRepo := repository.NewUserRepository(pg.Pool)
		winnerRepo := repository.NewWinnerRepository(pg.Pool)

		raffleService := usecase.NewRaffleService(userRepo, winnerRepo)
}