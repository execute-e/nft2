    CREATE TABLE IF NOT EXISTS users (
        id BIGSERIAL PRIMARY KEY,
        twitter_id VARCHAR(255) UNIQUE NOT NULL,
        twitter_username VARCHAR(255) NOT NULL,
        twitter_created_at TIMESTAMPTZ NOT NULL,
        discord_username VARCHAR(255) NOT NULL,
        wallet_address VARCHAR(100) NOT NULL, 
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS winners (
        id BIGSERIAL PRIMARY KEY,
        twitter_id VARCHAR(255) UNIQUE NOT NULL,
        twitter_username VARCHAR(255) NOT NULL,
        discord_username VARCHAR(255) NOT NULL,
        wallet_address VARCHAR(42) NOT NULL,
        won_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

CREATE TABLE IF NOT EXISTS waitlist (
    id BIGSERIAL PRIMARY KEY,
    wallet_address VARCHAR(100) NOT NULL, 
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS waitlist_result (
        id BIGSERIAL PRIMARY KEY,
        wallet_address VARCHAR(100) NOT NULL UNIQUE,
        result VARCHAR(50) NOT NULL,
        checked BOOLEAN NOT NULL,
        checked_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );