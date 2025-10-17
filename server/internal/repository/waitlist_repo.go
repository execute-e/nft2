package repository

import (
	"context"
	"errors"
	"fmt"

	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/ItsXomyak/internal/domain"
	"github.com/ItsXomyak/pkg/logger"
)

type waitlistRepository struct {
	pool *pgxpool.Pool
}

func NewWaitlistRepository(pool *pgxpool.Pool) *waitlistRepository {
	return &waitlistRepository{pool: pool}
}

func (r *waitlistRepository) GetAll(ctx context.Context) ([]domain.Waitlist, error) {
	logger.Debug("getting all waitlist entries")
	query := "SELECT id, wallet_address, joined_at FROM waitlist"

	rows, err := r.pool.Query(ctx, query)
	if err != nil {
		logger.Error("failed to get all waitlist entries", "error", err)
		return nil, fmt.Errorf("failed to query all waitlist entries: %w", err)
	}
	defer rows.Close()

	var waitlistEntries []domain.Waitlist
	for rows.Next() {
		var entry domain.Waitlist
		err := rows.Scan(
			&entry.ID,
			&entry.WalletAddress,
			&entry.JoinedAt,
		)
		if err != nil {
			logger.Error("failed to scan waitlist entry", "error", err)
			return nil, fmt.Errorf("failed to scan waitlist entry: %w", err)
		}
		waitlistEntries = append(waitlistEntries, entry)
	}

	if rows.Err() != nil {
		logger.Error("failed to get all waitlist entries", "error", err)
		return nil, fmt.Errorf("failed to get all waitlist entries: %w", err)
	}

	logger.Info("got all waitlist entries")
	return waitlistEntries, nil
}

func (r *waitlistRepository) Truncate(ctx context.Context) error {
	query := "TRUNCATE waitlist"
	_, err := r.pool.Exec(ctx, query)
	if err != nil {
		logger.Error("failed to truncate waitlist", "error", err)
		return fmt.Errorf("failed to truncate waitlist: %w", err)
	}
	return nil
}

func (r *waitlistRepository) AddEntry(ctx context.Context, entry domain.Waitlist) error {
    logger.Debug("adding waitlist entry", "wallet_address", entry.WalletAddress)

    query := "INSERT INTO waitlist (wallet_address) VALUES ($1)"
    _, err := r.pool.Exec(ctx, query, entry.WalletAddress)

    if err != nil {
        var pgErr *pgconn.PgError 

        if errors.As(err, &pgErr) && pgErr.Code == "23505" {
            return domain.ErrWaitlistEntryAlreadyExists
        }

        logger.Error("failed to add waitlist entry", "error", err)
        return fmt.Errorf("failed to add waitlist entry: %w", err)
    }

    return nil
}


func (r *waitlistRepository) DeleteUserByID(ctx context.Context, id int64) error {
	logger.Debug("deleting user", "id", id)
	query := "DELETE FROM waitlist WHERE id = $1"

	cmdTag, err := r.pool.Exec(ctx, query, id)
	if err != nil {
		logger.Error("failed to execute delete query", "error", err)
		return fmt.Errorf("failed to delete waitlist entry: %w", err)
	}

	if cmdTag.RowsAffected() == 0 {
		logger.Warn("waitlist entry not found for deletion", "id", id)
		return domain.ErrUserNotFound
	}

	logger.Info("waitlist entry deleted successfully", "id", id)
	return nil
}

func (r *waitlistRepository) FindByWalletAddress(ctx context.Context, walletAddress string) (*domain.Waitlist, error) {
	logger.Debug("finding waitlist entry by wallet address", "wallet_address", walletAddress)
	query := "SELECT id, wallet_address, joined_at FROM waitlist WHERE wallet_address = $1"

	var waitlistEntry domain.Waitlist
	err := r.pool.QueryRow(ctx, query, walletAddress).Scan(
		&waitlistEntry.ID,
		&waitlistEntry.WalletAddress,
		&waitlistEntry.JoinedAt,
	)

	if err != nil {
		logger.Error("failed to find waitlist entry by wallet address", "error", err)
		return nil, fmt.Errorf("failed to find waitlist entry by wallet address: %w", err)
	}

	logger.Info("waitlist entry found successfully", "wallet_address", walletAddress)
	return &waitlistEntry, nil
}