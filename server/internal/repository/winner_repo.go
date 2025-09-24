package repository

import (
	"context"
	"fmt"

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
	query := "SELECT id, twitter_id, twitter_screen_name, discord_name, wallet_address FROM winners"
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
			&user.Twitter_screen_name,
			&user.Discord_name,
			&user.Wallet_address,
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
	
	query := "INSERT INTO winners (twitter_id, twitter_screen_name, discord_name, wallet_address) VALUES ($1, $2, $3, $4)"
	_, err := w.pool.Exec(ctx, query, entity.TwitterID, entity.Twitter_screen_name, entity.Discord_name, entity.Wallet_address)
	if err != nil {
		logger.Error("failed to create winner", "error", err)
		return fmt.Errorf("failed to create winner: %w", err)
	}

	logger.Info("winner created successfully", "twitter_id", entity.TwitterID)
	return nil
}

func (w *winnerRepository) DeleteWinnerByID(ctx context.Context, id int) error {
	logger.Debug("deleting winner", "id", id)
	query := "DELETE FROM winners WHERE id = $1"
	_, err := w.pool.Exec(ctx, query, id)
	if err != nil {
		logger.Error("failed to delete winner", "error", err)
		return fmt.Errorf("failed to delete winner: %w", err)
	}

	logger.Info("winner deleted successfully", "id", id)
	return nil
}

func(w *winnerRepository) FindByTwitterID(ctx context.Context, id string) (*domain.User, error) {
	logger.Debug("finding winner by twitter id", "twitter_id", id)
	query := "SELECT id, twitter_id, twitter_screen_name, discord_name, wallet_address FROM winners WHERE twitter_id = $1"
	var user domain.User
	err := w.pool.QueryRow(ctx, query, id).Scan(
		&user.ID,
		&user.TwitterID,
		&user.Twitter_screen_name,
		&user.Discord_name,
		&user.Wallet_address,
	)
	if err != nil {
		logger.Error("failed to find winner by twitter id", "error", err)
		return &domain.User{}, fmt.Errorf("failed to find winner by twitter id: %w", err)
	}
	logger.Info("winner found successfully", "twitter_id", id)
	return &user, nil
}