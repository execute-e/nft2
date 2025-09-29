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

type winnerRepository struct {
	pool *pgxpool.Pool
}

func NewWinnerRepository(pool *pgxpool.Pool) *winnerRepository {
	return &winnerRepository{
		pool: pool,
	}
}

func (w *winnerRepository) GetAll(ctx context.Context) ([]domain.User, error) {
	logger.Debug("getting all winners")
	query := "SELECT id, twitter_id, twitter_username, discord_username, wallet_address FROM winners"
	rows, err := w.pool.Query(ctx, query)
	if err != nil {
		logger.Error("failed to get all winners", "error", err)
		return nil, fmt.Errorf("failed to get all winners: %w", err)
	}

	var users []domain.User
	for rows.Next() {
		var user domain.User
		err := rows.Scan(
			&user.ID,
			&user.TwitterID,
			&user.TwitterUsername,
			&user.DiscordUsername,
			&user.WalletAddress,
		)
		if err != nil {
			logger.Error("failed to scan user", "error", err)
			return nil, fmt.Errorf("failed to scan user: %w", err)
		}
		users = append(users, user)
	}

	if rows.Err() != nil {
		logger.Error("failed to get all winners", "error", err)
		return nil, fmt.Errorf("failed to get all winners: %w", err)
	}

	return users, nil
}

func (w *winnerRepository) Truncate(ctx context.Context) error {
	logger.Debug("truncating winners")
	query := `TRUNCATE winners`
	_, err := w.pool.Exec(ctx, query)
	if err != nil {
		logger.Error("failed to truncate winners", "error", err)
		return fmt.Errorf("failed to truncate winners: %w", err)
	}
	logger.Info("winners truncated successfully")
	return err
}


func (w *winnerRepository) CreateWinner(ctx context.Context, entity domain.User) error {
	logger.Debug("creating winner")
	
	query := "INSERT INTO winners (twitter_id, twitter_username, discord_username, wallet_address) VALUES ($1, $2, $3, $4)"
	_, err := w.pool.Exec(ctx, query, entity.TwitterID, entity.TwitterUsername, entity.DiscordUsername, entity.WalletAddress)
	if err != nil {
		logger.Error("failed to create winner", "error", err)
		return fmt.Errorf("failed to create winner: %w", err)
	}

	logger.Info("winner created successfully", "twitter_id", entity.TwitterID)
	return nil
}

func (r *winnerRepository) DeleteWinnerByID(ctx context.Context, id int64) error {
	logger.Debug("deleting winner", "id", id)
	query := "DELETE FROM winners WHERE id = $1"

	cmdTag, err := r.pool.Exec(ctx, query, id)
	if err != nil {
		logger.Error("failed to execute delete query", "error", err)
		return fmt.Errorf("failed to delete winner: %w", err)
	}

	if cmdTag.RowsAffected() == 0 {
		logger.Warn("winner not found for deletion", "id", id)
		return domain.ErrUserNotFound
	}

	logger.Info("winner deleted successfully", "id", id)
	return nil
}

func (w *winnerRepository) FindByTwitterID(ctx context.Context, id string) (*domain.User, error) {
    logger.Debug("finding winner by twitter id", "twitter_id", id)

    query := `SELECT id, twitter_id, twitter_username, discord_username, wallet_address
              FROM winners 
              WHERE twitter_id = $1`

    var winner domain.User
    row := w.pool.QueryRow(ctx, query, id)
    
    err := row.Scan(
        &winner.ID,
        &winner.TwitterID,
        &winner.TwitterUsername,
        &winner.DiscordUsername,
        &winner.WalletAddress,
    )

    if err != nil {
				if errors.Is(err, pgx.ErrNoRows) {
						logger.Info("winner not found", "twitter_id", id)
						return nil, domain.ErrUserNotFound
				}
				logger.Warn("failed to find winner by twitter id", "error", err)
        return nil, err
    }

		logger.Info("winner found successfully", "twitter_id", id)
    return &winner, nil
}