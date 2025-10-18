CREATE TABLE IF NOT EXISTS waitlist (
        id BIGSERIAL PRIMARY KEY,
        wallet_address VARCHAR(100) NOT NULL, 
        joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );


CREATE TABLE IF NOT EXISTS waitlist_result (
        id BIGSERIAL PRIMARY KEY,
        wallet_address VARCHAR(100) NOT NULL,
        result VARCHAR(50) NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );