## \#\# Пользовательский маршрут

docker-compose exec db psql -U postgres -d raffle_db

INSERT INTO users (twitter_id, twitter_username, twitter_created_at, discord_username, wallet_address) VALUES
('111111111', 'test_user_one', '2022-01-15T10:00:00Z', 'discord_one#1111', '0x1111111111111111111111111111111111111111'),
('222222222', 'dev_two', '2023-05-20T12:30:00Z', 'dev_two#2222', '0x2222222222222222222222222222222222222222'),
('333333333', 'artist_three', '2021-11-01T20:00:00Z', 'artist_3#3333', '0x3333333333333333333333333333333333333333'),
-- Этот аккаунт "молодой", чтобы тестировать логику проверки возраста (>6 месяцев)
('444444444', 'new_user_four', NOW() - INTERVAL '2 months', 'newbie#4444', '0x4444444444444444444444444444444444444444'),
('555555555', 'gamer_five', '2020-02-29T05:45:00Z', 'gamer555#5555', '0x5555555555555555555555555555555555555555');

### **Регистрация нового участника**

```bash
curl -X POST ${import.meta.env.VITE_API_BASE_URL}/raffle/register \
-H "Content-Type: application/json" \
-H "Cookie: user_session=<SESSION_COOKIE>" \
-d '{
  "discord_username": "test_user",
  "wallet_address": "0x1234567890123456789012345678901234567890"
}'
```

- **`-H "Content-Type: ..."`**: Указывает, что мы отправляем JSON.
- **`-H "Cookie: ..."`**: Передает вашу сессию для аутентификации.
- **`-d '{...}'`**: Тело запроса с данными.

---

## \#\# Админские маршруты

Все админские запросы требуют **Bearer токен** в заголовке `Authorization`.

### **Получить список всех участников**

```bash
curl -X GET ${import.meta.env.VITE_API_BASE_URL}/admin/participants \
-H "Authorization: Bearer admin"
```

### **Очистить таблицу участников**

```bash
curl -X DELETE ${import.meta.env.VITE_API_BASE_URL}/admin/participants \
-H "Authorization: Bearer admin"
```

### **Удалить участника по ID**

Замените `:id` (например, `1`) на реальный ID участника.

```bash
curl -X DELETE ${import.meta.env.VITE_API_BASE_URL}/admin/participants/1 \
-H "Authorization: Bearer admin"
```

### **Выбрать и назначить победителей**

```bash
curl -X POST ${import.meta.env.VITE_API_BASE_URL}/admin/winners \
-H "Content-Type: application/json" \
-H "Authorization: Bearer admin" \
-d '{
  "limit": 3
}'
```

### **Очистить таблицу победителей**

```bash
curl -X DELETE ${import.meta.env.VITE_API_BASE_URL}/admin/winners \
-H "Authorization: Bearer admin"
```

### **Получить список всех победителей**

```bash
curl -X GET ${import.meta.env.VITE_API_BASE_URL}/admin/winners \
-H "Authorization: Bearer admin"
```

### **Удалить победителя по ID**

Замените `:id` (например, `1`) на реальный ID победителя.

```bash
curl -X DELETE ${import.meta.env.VITE_API_BASE_URL}/admin/winners/1 \
-H "Authorization: Bearer admin"
```
