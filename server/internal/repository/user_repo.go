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
	query := "SELECT id, twitter_id, twitter_username, discord_username, wallet_address, created_at FROM users ORDER BY created_at DESC"
	
	rows, err := r.pool.Query(ctx, query)
	if err != nil {
		logger.Error("failed to get all users", "error", err)
		return nil, fmt.Errorf("failed to query all users: %w", err)
	}
	defer rows.Close()

	var users []domain.User
	for rows.Next() {
		var user domain.User
		err := rows.Scan(
			&user.ID,
			&user.TwitterID,
			&user.TwitterUsername,
			&user.DiscordUsername,
			&user.WalletAddress,
			&user.CreatedAt,
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
	query := "INSERT INTO users (twitter_id, twitter_username, twitter_created_at, discord_username, wallet_address) VALUES ($1, $2, $3, $4, $5)"
	_, err := r.pool.Exec(ctx, query, entity.TwitterID, entity.TwitterUsername, entity.TwitterCreatedAt ,entity.DiscordUsername, entity.WalletAddress)
	if err != nil {
		var pgErr *pgx.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "23505" {
				logger.Error("user already exists in users table", "error", err)
				return domain.ErrUserAlreadyExists
		}
		logger.Error("failed to create user", "error", err)
		return fmt.Errorf("failed to create user in users table: %w", err)
	}
	logger.Info("user created successfully", "twitter_id", entity.TwitterID)
	return nil
}

func (r *userRepository) FindRandomEligibleUsers(ctx context.Context, limit int) ([]domain.User, error) {
	logger.Debug("finding random eligible users")
	query := `
		SELECT id, twitter_id, twitter_username, discord_username, wallet_address
		FROM users
		WHERE twitter_id NOT IN (
		    SELECT twitter_id FROM winners
		)
		ORDER BY gen_random_uuid()
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
			&user.TwitterUsername,
			&user.DiscordUsername,
			&user.WalletAddress,
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

func (r *userRepository) DeleteUserByID(ctx context.Context, id int64) error {
	logger.Debug("deleting user", "id", id)
	query := "DELETE FROM users WHERE id = $1"

	cmdTag, err := r.pool.Exec(ctx, query, id)
	if err != nil {
		logger.Error("failed to execute delete query", "error", err)
		return fmt.Errorf("failed to delete user: %w", err)
	}

	if cmdTag.RowsAffected() == 0 {
		logger.Warn("user not found for deletion", "id", id)
		return domain.ErrUserNotFound
	}

	logger.Info("user deleted successfully", "id", id)
	return nil
}


func (r *userRepository) DeleteUsersByIDs(ctx context.Context, ids []int64) error {
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