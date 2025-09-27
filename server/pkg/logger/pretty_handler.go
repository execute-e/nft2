package logger

import (
	"context"
	"fmt"
	"log/slog"
	"os"
	"strings"
)

type PrettyHandler struct {
	out    *os.File
	opts   slog.HandlerOptions
	levels map[slog.Level]string
}

func NewPrettyHandler(out *os.File, opts slog.HandlerOptions) slog.Handler {
	return &PrettyHandler{
		out:  out,
		opts: opts,
		levels: map[slog.Level]string{
			slog.LevelDebug: colorGray("[DEBUG]"),
			slog.LevelInfo:  colorCyan("[INFO]"),
			slog.LevelWarn:  colorYellow("[WARN]"),
			slog.LevelError: colorRed("[ERROR]"),
		},
	}
}

func (h *PrettyHandler) Enabled(_ context.Context, level slog.Level) bool {
	return level >= h.opts.Level.Level()
}

func (h *PrettyHandler) Handle(_ context.Context, r slog.Record) error {
	levelStr := h.levels[r.Level]
	timestamp := r.Time.Format("15:04:05")

	var attrs []string
	r.Attrs(func(a slog.Attr) bool {
		attrs = append(attrs, fmt.Sprintf("%s=%v", a.Key, a.Value))
		return true
	})

	msg := fmt.Sprintf("%s %s %s", colorGray(timestamp), levelStr, r.Message)
	if len(attrs) > 0 {
		msg += " " + strings.Join(attrs, " ")
	}
	fmt.Fprintln(h.out, msg)
	return nil
}

func (h *PrettyHandler) WithAttrs(_ []slog.Attr) slog.Handler { return h }
func (h *PrettyHandler) WithGroup(_ string) slog.Handler      { return h }