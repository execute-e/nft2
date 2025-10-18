package domain

import "time"

type Waitlist struct {
	ID            *int64  `json:"id"`
	WalletAddress *string   `json:"wallet_address"`
	JoinedAt      *time.Time `json:"joined_at"`
}