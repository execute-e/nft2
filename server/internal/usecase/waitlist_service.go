package usecase

import (
	"context"
	"errors"
	"fmt"

	"github.com/ItsXomyak/internal/domain"
	"github.com/ItsXomyak/pkg/logger"
)

type WaitlistRepo interface {
	GetAll(ctx context.Context) ([]domain.Waitlist, error)
	Truncate(ctx context.Context) error
	AddEntry(ctx context.Context, entity domain.Waitlist) error
	DeleteUserByID(ctx context.Context, id int64) error
	FindByWalletAddress(ctx context.Context, walletAddress string) (*domain.Waitlist, error)
}

type WaitlistService struct {
	waitlistRepo WaitlistRepo
}

func NewWaitlistService(waitlistRepo WaitlistRepo) *WaitlistService {
	return &WaitlistService{waitlistRepo: waitlistRepo}
}

func (w *WaitlistService) GetAllWaitlistEntries(ctx context.Context) ([]domain.Waitlist, error) {
	return w.waitlistRepo.GetAll(ctx)
}

func (w *WaitlistService) TruncateWaitlist(ctx context.Context) error {
	return w.waitlistRepo.Truncate(ctx)
}

func (w *WaitlistService) AddWaitlistEntry(ctx context.Context, entry *domain.Waitlist) error {
    logger.Debug("adding waitlist entry", "wallet_address", entry.WalletAddress)

    _, err := w.waitlistRepo.FindByWalletAddress(ctx, entry.WalletAddress)

    if err == nil {
        logger.Warn("waitlist entry already exists", "wallet_address", entry.WalletAddress)
        return domain.ErrWaitlistEntryAlreadyExists
    }

    if !errors.Is(err, domain.ErrNotFound) {
        logger.Error("failed to check for existing waitlist entry", "error", err)
        return fmt.Errorf("failed to check for existing entry: %w", err)
    }

    if err := w.waitlistRepo.AddEntry(ctx, *entry); err != nil {
        logger.Error("failed to add waitlist entry", "error", err)
        return fmt.Errorf("failed to add waitlist entry: %w", err)
    }

    logger.Info("waitlist entry added successfully", "wallet_address", entry.WalletAddress)
    return nil
}

func (w *WaitlistService) DeleteWaitlistEntryByID(ctx context.Context, id int64) error {
	logger.Debug("deleting waitlist entry", "id", id)
	if err := w.waitlistRepo.DeleteUserByID(ctx, id); err != nil {
		logger.Error("failed to delete waitlist entry", "error", err)
		return fmt.Errorf("failed to delete waitlist entry: %w", err)
	}
	logger.Info("waitlist entry deleted successfully", "id", id)
	return nil
	}