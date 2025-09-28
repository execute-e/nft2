package domain

import "time"

type User struct {
	ID               int64     `json:"id" db:"id"`
	TwitterID        string    `json:"twitter_id" db:"twitter_id"`
	TwitterUsername  string    `json:"twitter_username" db:"twitter_username"`
	TwitterCreatedAt time.Time `json:"-" db:"twitter_created_at"` 
	DiscordUsername  string    `json:"discord_username" db:"discord_username"`
	WalletAddress    string    `json:"wallet_address" db:"wallet_address"`
	CreatedAt        time.Time `json:"created_at" db:"created_at"`
}

type RegistrationForm struct {
	DiscordUsername string `json:"discord_username" binding:"required"`
	WalletAddress   string `json:"wallet_address" binding:"required,eth_addr"` 
}