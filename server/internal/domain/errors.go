package domain

import "errors"

var (
	ErrUserNotFound = errors.New("user not found")
	ErrNotFound = errors.New("record not found")
	ErrUserAlreadyExists = errors.New("You are already participating in the giveaway")
	ErrUserAlreadyWon = errors.New("You have already won the giveaway")
	ErrWaitlistEntryNotFound = errors.New("Waitlist entry not found")
	ErrWaitlistEntryAlreadyExists = errors.New("Waitlist entry already exists")
)