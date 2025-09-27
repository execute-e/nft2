CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    twitter_id VARCHAR(255) UNIQUE NOT NULL,
    twitter_username VARCHAR(255) NOT NULL,
    twitter_created_at TIMESTAMPTZ NOT NULL,
    discord_username VARCHAR(255) NOT NULL,
    wallet_address VARCHAR(100) NOT NULL, 
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_twitter_id ON users(twitter_id);
