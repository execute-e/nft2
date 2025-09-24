package domain

type User struct {
	ID                  int64  `json:"id"`
	TwitterID           string `json:"twitter_id"`
	Twitter_screen_name string `json:"twitter_screen_name"`
	Discord_name        string `json:"discord_name"`
	Wallet_address      string `json:"wallet_address"`
}
