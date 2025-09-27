package twitter

import (
	"context"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"time"

	"golang.org/x/oauth2"
)

const (
	authURL  = "https://twitter.com/i/oauth2/authorize"
	tokenURL = "https://api.twitter.com/2/oauth2/token"
	userURL  = "https://api.twitter.com/2/users/me?user.fields=created_at"
)

type Client struct {
	oauth2Config *oauth2.Config
}

type UserProfile struct {
	Data struct {
		ID        string    `json:"id"`
		Username  string    `json:"username"`
		CreatedAt time.Time `json:"created_at"`
	} `json:"data"`
}

func NewClient(apiKey, apiSecret, callbackURL string) *Client {
	return &Client{
		oauth2Config: &oauth2.Config{
			ClientID:     apiKey,
			ClientSecret: apiSecret,
			RedirectURL:  callbackURL,
			Scopes:       []string{"tweet.read", "users.read"},
			Endpoint: oauth2.Endpoint{
				AuthURL:  authURL,
				TokenURL: tokenURL,
			},
		},
	}
}

func (c *Client) GenerateAuthURL(state string) (string, string) {
	verifier := oauth2.GenerateVerifier()
	challenge := sha256.Sum256([]byte(verifier))
	challengeB64 := base64.RawURLEncoding.EncodeToString(challenge[:])

	authURL := c.oauth2Config.AuthCodeURL(
		state,
		oauth2.SetAuthURLParam("code_challenge", challengeB64),
		oauth2.SetAuthURLParam("code_challenge_method", "S256"),
	)
	return authURL, verifier
}

//  Обмен авторизационного кода на токен доступа.
func (c *Client) ExchangeCode(ctx context.Context, code, verifier string) (*oauth2.Token, error) {
	return c.oauth2Config.Exchange(
		ctx,
		code,
		oauth2.SetAuthURLParam("code_verifier", verifier),
	)
}


func (c *Client) GetUserProfile(ctx context.Context, token *oauth2.Token) (*UserProfile, error) {
	client := c.oauth2Config.Client(ctx, token)
	resp, err := client.Get(userURL)
	if err != nil {
		return nil, fmt.Errorf("failed to get user profile: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("twitter API returned non-200 status: %d", resp.StatusCode)
	}

	var profile UserProfile
	if err := json.NewDecoder(resp.Body).Decode(&profile); err != nil {
		return nil, fmt.Errorf("failed to decode user profile: %w", err)
	}
	return &profile, nil
}

func GenerateState() string {
	b := make([]byte, 32)
	rand.Read(b)
	return base64.RawURLEncoding.EncodeToString(b)
}