package usecase

import (
	"context"

	"github.com/ItsXomyak/internal/domain"
	"github.com/ItsXomyak/pkg/logger"
)

type WaitlistResRepository interface {
	GetByWalletAddress(ctx context.Context, walletAddress string) (*domain.WaitlistResult, error)
	MarkAsChecked(ctx context.Context, walletAddress string) error
	GetAllResults(ctx context.Context) ([]domain.WaitlistResult, error)
	Truncate(ctx context.Context) error
	DeleteByWalletAddress(ctx context.Context, walletAddress string) error
}

type WaitlistResService struct {
	repo WaitlistResRepository
}

func NewWaitlistResService(repo WaitlistResRepository) *WaitlistResService {
	return &WaitlistResService{
		repo: repo,
	}
}

func (s *WaitlistResService) GetWaitlistResultByWalletAddress(ctx context.Context, walletAddress string) (*domain.WaitlistResult, error) {
	logger.Debug("getting waitlist result by wallet address", "wallet_address", walletAddress)
	result, err := s.repo.GetByWalletAddress(ctx, walletAddress)
	if err != nil {
		return nil, err
	}

	logger.Info("waitlist result retrieved successfully", "wallet_address", walletAddress)
	err = s.repo.MarkAsChecked(ctx, walletAddress)
	if err != nil {
		return nil, err
	}
	
	return result, nil
}

func (s *WaitlistResService) GetAllWaitlistResults(ctx context.Context) ([]domain.WaitlistResult, error) {
	logger.Debug("getting all waitlist results")
	results, err := s.repo.GetAllResults(ctx)
	if err != nil {
		return nil, err
	}

	logger.Info("all waitlist results retrieved successfully")
	return results, nil
}

func (s *WaitlistResService) TruncateWaitlistResults(ctx context.Context) error {
	logger.Debug("truncating waitlist results")
	err := s.repo.Truncate(ctx)
	if err != nil {
		return err
	}

	logger.Info("waitlist results truncated successfully")
	return nil
}

func (s *WaitlistResService) DeleteWaitlistResultByWalletAddress(ctx context.Context, walletAddress string) error {
	logger.Debug("deleting waitlist result by wallet address", "wallet_address", walletAddress)
	err := s.repo.DeleteByWalletAddress(ctx, walletAddress)
	if err != nil {
		return err
	}

	logger.Info("waitlist result deleted successfully", "wallet_address", walletAddress)
	return nil
}

