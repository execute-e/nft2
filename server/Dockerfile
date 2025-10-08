# Этап 1: Сборка
FROM golang:1.24-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Объявляем аргумент сборки, который Docker предоставит автоматически (amd64, arm64 и т.д.)
ARG TARGETARCH

# ИСПРАВЛЕНИЕ: Используем TARGETARCH, чтобы явно указать Go, для какой архитектуры компилировать.
RUN CGO_ENABLED=0 GOOS=linux GOARCH=${TARGETARCH} go build \
    -ldflags="-w -s" \
    -o /app/main \
    ./cmd/app/main.go

# Этап 2: Финальный образ
# Этап 2: Финальный образ
FROM alpine:latest

WORKDIR /app

# Копируем скомпилированный Go-бинарник
COPY --from=builder /app/main .

# Копируем статику админки. Путь указан относительно контекста сборки (папки server).
COPY internal/delivery/http/static/admin ./static/admin

# Хорошая практика — убедиться, что файл исполняемый
RUN chmod +x ./main

EXPOSE 8080
ENTRYPOINT ["./main"]