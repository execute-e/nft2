package domain

import "errors"

var (
	ErrUserNotFound = errors.New("user not found")
	ErrUserAlreadyExists = errors.New("You are already participating in the giveaway")
)