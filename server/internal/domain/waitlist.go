package domain

type Waitlist struct {
	ID            int64  `json:"id"`
	WalletAddress string `json:"wallet_address"`
	JoinedAt      string `json:"joined_at"`
}