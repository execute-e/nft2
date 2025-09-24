package logger

import (
	"context"
	"log/slog"
	"os"
)

var Log *slog.Logger

func Init(env string) {
	opts := slog.HandlerOptions{
		Level: slog.LevelDebug,
	}

	var handler slog.Handler

	if env == "development" {
		handler = NewPrettyHandler(os.Stdout, opts)
	} else {
		handler = slog.NewJSONHandler(os.Stdout, &opts)
	}

	Log = slog.New(handler)
	slog.SetDefault(Log)
}

func Info(msg string, args ...any) {
	Log.Info(msg, args...)
}

func Error(msg string, args ...any) {
	Log.Error(msg, args...)
}

func Debug(msg string, args ...any) {
	Log.Debug(msg, args...)
}

func Warn(msg string, args ...any) {
	Log.Warn(msg, args...)
}

func WithContext(ctx context.Context) *slog.Logger {
	return slog.Default().With(slog.Any("ctx", ctx))
}