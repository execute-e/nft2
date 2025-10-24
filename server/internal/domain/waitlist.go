package domain

import "time"

type Waitlist struct {
	ID            *int64  `json:"id"`
	WalletAddress *string   `json:"wallet_address"`
	JoinedAt      *time.Time `json:"joined_at"`
}

type WaitlistResult struct {
    ID            int64     `json:"id"`
    WalletAddress string    `json:"wallet_address"`
    Result        string    `json:"result"`          // e.g., "1 NFT", "Tier 2", "5 Tokens"
    Checked       bool      `json:"checked"`
    CheckedAt     *time.Time `json:"checked_at"`   
    CreatedAt     time.Time `json:"created_at"`
}