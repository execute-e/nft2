# Этап 1: Сборка приложения
FROM node:18-alpine AS builder

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем весь код
COPY . .

# Принимаем build argument для API URL
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Собираем production build
RUN npm run build

# Этап 2: Nginx для раздачи статики
FROM nginx:alpine

# Копируем собранные файлы из предыдущего этапа
COPY --from=builder /app/dist /usr/share/nginx/html

# Копируем кастомный конфиг nginx (опционально)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]