package domain

import "errors"

var ErrUserAlreadyExists = errors.New("user with this data already registered")