
## \#\# Пользовательский маршрут

### **Регистрация нового участника**

```bash
curl -X POST http://localhost:8080/raffle/register \
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
curl -X GET http://localhost:8080/admin/participants \
-H "Authorization: Bearer admin"
```

### **Очистить таблицу участников**

```bash
curl -X DELETE http://localhost:8080/admin/participants \
-H "Authorization: Bearer admin"
```

### **Удалить участника по ID**

Замените `:id` (например, `1`) на реальный ID участника.

```bash
curl -X DELETE http://localhost:8080/admin/participants/1 \
-H "Authorization: Bearer admin"
```

### **Выбрать и назначить победителей**

```bash
curl -X POST http://localhost:8080/admin/winners \
-H "Content-Type: application/json" \
-H "Authorization: Bearer admin" \
-d '{
  "limit": 3
}'
```

### **Очистить таблицу победителей**

```bash
curl -X DELETE http://localhost:8080/admin/winners \
-H "Authorization: Bearer admin"
```

### **Получить список всех победителей**

```bash
curl -X GET http://localhost:8080/admin/winners \
-H "Authorization: Bearer admin"
```

### **Удалить победителя по ID**

Замените `:id` (например, `1`) на реальный ID победителя.

```bash
curl -X DELETE http://localhost:8080/admin/winners/1 \
-H "Authorization: Bearer admin"
```
