package usecase

import (
	"context"
	"errors"
	"fmt"

	"github.com/ItsXomyak/internal/domain"
	"github.com/ItsXomyak/pkg/logger"
)

type UserRepo interface {
	GetAll(ctx context.Context) ([]domain.User, error)
	Truncate(ctx context.Context) error
	CreateUser(ctx context.Context, entity domain.User) error
	FindRandomEligibleUsers(ctx context.Context, limit int) ([]domain.User, error)
	DeleteUserByID(ctx context.Context, id int64) error
	DeleteUsersByIDs(ctx context.Context, ids []int64) error
}


type WinnerRepo interface {
	Truncate(ctx context.Context) error
	CreateWinner(ctx context.Context, entity domain.User) error
	GetAll(ctx context.Context) ([]domain.User, error)
	DeleteWinnerByID(ctx context.Context, id int64) error
	FindByTwitterID(ctx context.Context, id string) (*domain.User, error)
	FindAllPublic(ctx context.Context) ([]domain.PublicWinnerDTO, error)
}

type RaffleService struct {
	userRepo UserRepo
	winnerRepo WinnerRepo
}

func NewRaffleService(userRepo UserRepo, winnerRepo WinnerRepo) *RaffleService {
	return &RaffleService{userRepo: userRepo, winnerRepo: winnerRepo}
}

func (w *RaffleService) GetRandomEligibleUsers(ctx context.Context, limit int) ([]domain.User, error) {
	return w.userRepo.FindRandomEligibleUsers(ctx, limit)
}

func (w *RaffleService) RegisterUser(ctx context.Context, user *domain.User) error {
	logger.Debug("registering user", "twitter_id", user.TwitterID)

	// попытка найти пользователя в таблице победителей
	_, err := w.winnerRepo.FindByTwitterID(ctx, user.TwitterID)

	// TODO: доработка
	// if err != nil && !errors.Is(err, domain.ErrUserNotFound) {
	// 	logger.Error("failed to check for existing winner", "error", err)
	// 	return fmt.Errorf("failed to check for existing winner: %w", err)
	// }

	if err == nil {
		logger.Info("user already exists in winners table", "twitter_id", user.TwitterID)
		return fmt.Errorf("user with Twitter ID %s has already won", user.TwitterID)
	}

	err = w.userRepo.CreateUser(ctx, *user)
	if err != nil {
		logger.Error("failed to register user in svc", "error", err)
		return domain.ErrUserAlreadyExists // TODO: доработка
	}

	logger.Info("user successfully registered", "twitter_id", user.TwitterID)
	return nil
}

func (w *RaffleService) DeleteAllUsers(ctx context.Context) error {
	logger.Debug("deleting all users")
	err := w.userRepo.Truncate(ctx)
	if err != nil {
		logger.Error("failed to delete all users", "error", err)
		return fmt.Errorf("failed to delete all users: %w", err)
	}
	logger.Info("all users deleted successfully")
	return nil
}

func (w *RaffleService) DeleteAllWinners(ctx context.Context) error {
	logger.Debug("deleting all winners")
	err := w.winnerRepo.Truncate(ctx)
	if err != nil {
		logger.Error("failed to delete all winners", "error", err)
		return fmt.Errorf("failed to delete all winners: %w", err)
	}
	logger.Info("all winners deleted successfully")
	return nil
}

func (w *RaffleService) SelectAndPromoteWinners(ctx context.Context, limit int) ([]domain.User, error) {
	logger.Debug("giving away users", "limit", limit)
	users, err := w.userRepo.FindRandomEligibleUsers(ctx, limit)
	if err != nil {
		logger.Error("failed to give away users", "error", err)
		return nil, fmt.Errorf("failed to give away users: %w", err)
	}

	for _, user := range users {
		err := w.winnerRepo.CreateWinner(ctx, user)
		if err != nil {
			logger.Error("failed to create winner", "error", err)
			return nil, fmt.Errorf("failed to create winner: %w", err)
		}
		err = w.userRepo.DeleteUserByID(ctx, user.ID)
		if err != nil {
			logger.Error("failed to delete user", "error", err)
			return nil, fmt.Errorf("failed to delete user: %w", err)
		}
	}

	logger.Info("users given away successfully", "count", len(users))
	return users, nil
}

func (w *RaffleService) ListAllUsers(ctx context.Context) ([]domain.User, error) {
	logger.Debug("listing all users")
	users, err := w.userRepo.GetAll(ctx)
	if err != nil {
		logger.Error("failed to list users", "error", err)
		return nil, fmt.Errorf("failed to list users: %w", err)
	}
	return users, nil
}

func (w *RaffleService) TruncateUsers(ctx context.Context) error {
	logger.Debug("truncating users")
	err := w.userRepo.Truncate(ctx)
	if err != nil {
		logger.Error("failed to truncate users", "error", err)
		return fmt.Errorf("failed to truncate users: %w", err)
	}
	return nil
}

func (w *RaffleService) TruncateWinners(ctx context.Context) error {
	logger.Debug("truncating winners")
	err := w.winnerRepo.Truncate(ctx)
	if err != nil {
		logger.Error("failed to truncate winners", "error", err)
		return fmt.Errorf("failed to truncate winners: %w", err)
	}
	return nil
}

func (s *RaffleService) ListPublicWinners(ctx context.Context) ([]domain.PublicWinnerDTO, error) {
	logger.Debug("listing public winners")
	return s.winnerRepo.FindAllPublic(ctx)
}

func (w *RaffleService) ListAllWinners(ctx context.Context) ([]domain.User, error) {
	logger.Debug("listing all winners")
	users, err := w.winnerRepo.GetAll(ctx)
	if err != nil {
		logger.Error("failed to list winners", "error", err)
		return nil, fmt.Errorf("failed to list winners: %w", err)
	}
	return users, nil
}

func (w *RaffleService) DeleteUserByID(ctx context.Context, id int64) error {
	logger.Debug("deleting user", "id", id)
	err := w.userRepo.DeleteUserByID(ctx, id)
	if err != nil {
		if errors.Is(err, domain.ErrUserNotFound) {
			logger.Info("user not found", "id", id)
			return domain.ErrUserNotFound 
		}
		logger.Error("failed to delete user", "error", err)
		return fmt.Errorf("failed to delete user: %w", err)
	}
	return nil
}

func (w *RaffleService) DeleteWinnerByID(ctx context.Context, id int64) error {
	logger.Debug("deleting winner", "id", id)
	err := w.winnerRepo.DeleteWinnerByID(ctx, id)
	if err != nil {
		if errors.Is(err, domain.ErrUserNotFound) {
			logger.Info("winner not found", "id", id)
			return domain.ErrUserNotFound 
		}
		logger.Error("failed to delete winner", "error", err)
		return fmt.Errorf("failed to delete winner: %w", err)
	}
	return nil
}
