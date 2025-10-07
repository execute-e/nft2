package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	ServerPort     string
	CallbackURL    string
	FrontendURL    string
	SessionSecret  string
	AdminToken     string
	DB             DBConfig
	Twitter        TwitterConfig
	LogLevel       string
}

type DBConfig struct {
	DSN string
}

type TwitterConfig struct {
	APIKey    string
	APISecret string
}

func Load() (*Config, error) {
	_ = godotenv.Load()

	dsn := os.Getenv("DATABASE_URL")

	return &Config{
		ServerPort:     os.Getenv("SERVER_PORT"),
		FrontendURL:    os.Getenv("FRONTEND_URL"),
		CallbackURL:    os.Getenv("CALLBACK_URL"),
		SessionSecret:  os.Getenv("SESSION_SECRET"),
		AdminToken:     os.Getenv("ADMIN_TOKEN"),
		DB: DBConfig{
			DSN: dsn,
		},
		Twitter: TwitterConfig{
			APIKey:    os.Getenv("API_KEY"),
			APISecret: os.Getenv("API_SECRET"),
		},
	}, nil
}