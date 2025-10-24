package repository

import (
	"context"
	"errors"
	"fmt"

	"github.com/jackc/pgx"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/ItsXomyak/internal/domain"
	"github.com/ItsXomyak/pkg/logger"
)

type waitlistResultRepository struct {
	pool *pgxpool.Pool
}

func NewWaitlistResultRepository(pool *pgxpool.Pool) *waitlistResultRepository {
	return &waitlistResultRepository{pool: pool}
}

func (r *waitlistRepository) GetByWalletAddress(ctx context.Context, walletAddress string) (*domain.WaitlistResult, error) {
	logger.Debug("getting waitlist result by wallet address", "wallet_address", walletAddress)
	query := "SELECT id, wallet_address, result, checked, checked_at, created_at FROM waitlist_result WHERE wallet_address=$1"

	var result domain.WaitlistResult
	err := r.pool.QueryRow(ctx, query, walletAddress).Scan(
		&result.ID,
		&result.WalletAddress,
		&result.Result,
		&result.Checked,
		&result.CheckedAt,
		&result.CreatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrNotFound 
		}
		logger.Error("failed to get waitlist result by wallet address", "error", err)
		return nil, fmt.Errorf("failed to get waitlist result by wallet address: %w", err)
	}

	logger.Info("waitlist result found successfully", "wallet_address", walletAddress)
	return &result, nil
}

func (r *waitlistResultRepository) MarkAsChecked(ctx context.Context, walletAddress string) error {
	logger.Debug("marking waitlist result as checked", "wallet_address", walletAddress)
	query := "UPDATE waitlist_result SET checked=true, checked_at=NOW() WHERE wallet_address=$1"

	_, err := r.pool.Exec(ctx, query, walletAddress)
	if err != nil {
		logger.Error("failed to mark waitlist result as checked", "error", err)
		return fmt.Errorf("failed to mark waitlist result as checked: %w", err)
	}

	logger.Info("waitlist result marked as checked successfully", "wallet_address", walletAddress)
	return nil
}

func (r *waitlistRepository) GetAllResults(ctx context.Context) ([]domain.WaitlistResult, error) {
	logger.Debug("getting all waitlist results")
	query := "SELECT id, wallet_address, result, checked, checked_at, created_at FROM waitlist_result"

	rows, err := r.pool.Query(ctx, query)
	if err != nil {
		logger.Error("failed to get all waitlist results", "error", err)
		return nil, fmt.Errorf("failed to query all waitlist results: %w", err)
	}
	defer rows.Close()

	var results []domain.WaitlistResult
	for rows.Next() {
		var result domain.WaitlistResult
		err := rows.Scan(
			&result.ID,
			&result.WalletAddress,
			&result.Result,
			&result.Checked,
			&result.CheckedAt,
			&result.CreatedAt,
		)
		if err != nil {
			logger.Error("failed to scan waitlist result", "error", err)
			return nil, fmt.Errorf("failed to scan waitlist result: %w", err)
		}
		results = append(results, result)
	}

	if rows.Err() != nil {
		logger.Error("failed to get all waitlist results", "error", err)
		return nil, fmt.Errorf("failed to get all waitlist results: %w", err)
	}

	logger.Info("got all waitlist results")
	return results, nil
}

func (r *waitlistResultRepository) Truncate(ctx context.Context) error {
	query := "TRUNCATE waitlist_result"
	_, err := r.pool.Exec(ctx, query)
	if err != nil {
		logger.Error("failed to truncate waitlist results", "error", err)
		return fmt.Errorf("failed to truncate waitlist results: %w", err)
	}
	return nil
}

func (r *waitlistRepository) DeleteByWalletAddress(ctx context.Context, walletAddress string) error {
		logger.Debug("deleting waitlist entry by wallet address", "wallet_address", walletAddress)
		query := "DELETE FROM waitlist_result WHERE wallet_address = $1"

		cmdTag, err := r.pool.Exec(ctx, query, walletAddress)
		if err != nil {
			logger.Error("failed to delete waitlist entry by wallet address", "error", err)
			return fmt.Errorf("failed to delete waitlist entry by wallet address: %w", err)
		}

		if cmdTag.RowsAffected() == 0 {
			logger.Warn("waitlist entry not found for deletion", "wallet_address", walletAddress)
			return domain.ErrWaitlistEntryNotFound
		}

		logger.Info("waitlist entry deleted successfully", "wallet_address", walletAddress)
		return nil
}