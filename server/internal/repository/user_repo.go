package repository

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/ItsXomyak/internal/domain"
	"github.com/ItsXomyak/pkg/logger"
)

type userRepository struct {
	pool *pgxpool.Pool
}

func NewUserRepository(pool *pgxpool.Pool) *userRepository {
	return &userRepository{
		pool: pool,
	}
}


func (r *userRepository) GetAll(ctx context.Context) ([]domain.User, error) {
	logger.Debug("getting all users")
	query := "SELECT id, twitter_id, twitter_screen_name, discord_name, wallet_address FROM users"
	
	rows, err := r.pool.Query(ctx, query)
	if err != nil {
		logger.Error("failed to get all users", "error", err)
		return nil, fmt.Errorf("failed to query all users: %w", err)
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
		logger.Error("failed to get all users", "error", err)
		return nil, fmt.Errorf("failed to get all users: %w", err)
	} 
	
	logger.Info("got all users")
	return users, nil
}

func (r *userRepository) Truncate(ctx context.Context) error {
	query := "TRUNCATE users"
	_, err := r.pool.Exec(ctx, query)
	if err != nil {
		logger.Error("failed to truncate users", "error", err)
		return fmt.Errorf("failed to truncate users: %w", err)
	}
	return nil
}

func (r *userRepository) CreateUser(ctx context.Context, entity domain.User) error {
	logger.Debug("creating user")
	query := "INSERT INTO users (twitter_id, twitter_screen_name, discord_name, wallet_address) VALUES ($1, $2, $3, $4)"
	_, err := r.pool.Exec(ctx, query, entity.TwitterID, entity.Twitter_screen_name, entity.Discord_name, entity.Wallet_address)
	if err != nil {
		logger.Error("failed to create user", "error", err)
		return fmt.Errorf("failed to create user: %w", err)
	}
	logger.Info("user created successfully", "twitter_id", entity.TwitterID)
	return nil

}

func (r *userRepository) FindRandomEligibleUsers(ctx context.Context, limit int) ([]domain.User, error) {
	logger.Debug("finding random eligible users")
	query := `
		SELECT id, twitter_id, twitter_screen_name, discord_name, wallet_address
		FROM users
		WHERE twitter_id NOT IN (
		    SELECT twitter_id FROM winners
		)
		ORDER BY RANDOM()
		LIMIT $1
	`
	
	rows, err := r.pool.Query(ctx, query, limit)
	if err != nil {
		logger.Error("failed to query random eligible users", "error", err)
		return nil, fmt.Errorf("failed to query random eligible users: %w", err)
	}
	defer rows.Close()

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
			logger.Error("failed to scan random eligible user row", "error", err)
			return nil, fmt.Errorf("failed to scan random eligible user row: %w", err)
		}
		users = append(users, user)
	}

	if rows.Err() != nil {
		logger.Error("row iteration error during random eligible user query", "error", rows.Err())
		return nil, fmt.Errorf("row iteration error: %w", rows.Err())
	}

	logger.Info("found random eligible users", "count", len(users))
	return users, nil
}

func (r *userRepository) DeleteUserByID(ctx context.Context, id int) error {
	logger.Debug("deleting user", "id", id)
	query := "DELETE FROM users WHERE id = $1"
	_, err := r.pool.Exec(ctx, query, id)
	if err != nil {
		logger.Error("failed to delete user", "error", err)
		return fmt.Errorf("failed to delete user: %w", err)
	}
	logger.Info("user deleted successfully", "id", id)
	return nil
}

func (r *userRepository) DeleteUserByIDs(ctx context.Context, ids []int64) error {
	logger.Debug("deleting users", "ids", ids)
	query := "DELETE FROM users WHERE id = ANY($1)"
	_, err := r.pool.Exec(ctx, query, ids)
	if err != nil {
		logger.Error("failed to delete user", "error", err)
		return fmt.Errorf("failed to delete user: %w", err)
	}
	logger.Info("users deleted successfully", "ids", ids)
	return nil
}