package usecase

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/ItsXomyak/pkg/twitter"
)

var ErrAccountTooNew = errors.New("twitter account must be at least 6 months old")

type AuthService struct {
	twitterClient *twitter.Client
}

func NewAuthService(twitterClient *twitter.Client) *AuthService {
	return &AuthService{twitterClient: twitterClient}
}

func (uc *AuthService) GenerateAuthURL() (string, string, string) {
	state := twitter.GenerateState()
	authURL, verifier := uc.twitterClient.GenerateAuthURL(state)
	return authURL, state, verifier
}

type TwitterAuthResult struct {
	TwitterID        string
	TwitterUsername  string
	TwitterCreatedAt time.Time
}

func (uc *AuthService) ProcessCallback(ctx context.Context, code, verifier string) (*TwitterAuthResult, error) {
	token, err := uc.twitterClient.ExchangeCode(ctx, code, verifier)
	if err != nil {
		return nil, fmt.Errorf("failed to exchange code for token: %w", err)
	}

	profile, err := uc.twitterClient.GetUserProfile(ctx, token)
	if err != nil {
		return nil, fmt.Errorf("failed to get user profile: %w", err)
	}


	//TODO: rewrite check twitter account age
	sixMonthsAgo := time.Now().AddDate(0, -6, 0)
	if profile.Data.CreatedAt.After(sixMonthsAgo) {
		return nil, ErrAccountTooNew
	}

	return &TwitterAuthResult{
		TwitterID:        profile.Data.ID,
		TwitterUsername:  profile.Data.Username,
		TwitterCreatedAt: profile.Data.CreatedAt,
	}, nil
}