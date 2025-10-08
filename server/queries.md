## \#\# Пользовательский маршрут

docker-compose exec db psql -U postgres -d raffle_db

INSERT INTO users (twitter_id, twitter_username, twitter_created_at, discord_username, wallet_address) VALUES
('111111111', 'test_user_one', '2022-01-15T10:00:00Z', 'discord_one#1111', '0x1111111111111111111111111111111111111111'),
('222222222', 'dev_two', '2023-05-20T12:30:00Z', 'dev_two#2222', '0x2222222222222222222222222222222222222222'),
('333333333', 'artist_three', '2021-11-01T20:00:00Z', 'artist_3#3333', '0x3333333333333333333333333333333333333333'),
-- Этот аккаунт "молодой", чтобы тестировать логику проверки возраста (>6 месяцев)
('444444444', 'new_user_four', NOW() - INTERVAL '2 months', 'newbie#4444', '0x4444444444444444444444444444444444444444'),
('555555555', 'gamer_five', '2020-02-29T05:45:00Z', 'gamer555#5555', '0x5555555555555555555555555555555555555555');

рандом данные

INSERT INTO users (twitter_id, twitter_username, twitter_created_at, discord_username, wallet_address, created_at) VALUES
('81749652', 'CryptoKing88', '2017-07-15 10:30:00Z', 'CryptoKing#1234', '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b', NOW()),
('94251234', 'NFTQueen', '2018-02-20 14:00:00Z', 'NFTQueen#5678', '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c', NOW()),
('10567890', 'DeFiDude', '2019-11-05 08:45:00Z', 'DeFiDude#9012', '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d', NOW()),
('11223344', 'SatoshiN', '2016-01-01 00:00:00Z', 'Satoshi#0001', '0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e', NOW()),
('12345678', 'EthereumEv', '2020-05-10 18:20:00Z', 'EthEvangelist#3456', '0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f', NOW()),
('23456789', 'BitcoinBelle', '2018-09-25 12:10:00Z', 'BitcoinBelle#7890', '0x6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a', NOW()),
('34567890', 'ChainlinkChad', '2021-03-15 22:05:00Z', 'LinkMarine#1122', '0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b', NOW()),
('45678901', 'SolanaStallion', '2022-08-01 16:55:00Z', 'SolStallion#3344', '0x8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c', NOW()),
('56789012', 'AvaAngel', '2021-12-12 11:11:00Z', 'AvalancheAngel#5566', '0x9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d', NOW()),
('67890123', 'PolygonPioneer', '2020-10-10 10:10:00Z', 'PolygonPioneer#7788', '0x0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e', NOW()),
('78901234', 'CardanoChamp', '2019-06-30 06:30:00Z', 'AdaChamp#9900', '0x1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f', NOW()),
('89012345', 'ShibaSoldier', '2022-04-20 04:20:00Z', 'ShibSoldier#1337', '0x2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a', NOW()),
('90123456', 'DogeDiamond', '2021-05-15 15:15:00Z', 'DogeHands#2468', '0x3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b', NOW()),
('12345098', 'Web3Wizard', '2023-01-20 09:00:00Z', 'Web3Wiz#8642', '0x4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c', NOW()),
('23451098', 'MetaverseMaiden', '2022-11-18 19:40:00Z', 'MetaMaiden#1357', '0x5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d', NOW()),
('34521098', 'DAOOperator', '2021-08-22 14:30:00Z', 'DAOOp#2468', '0x6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e', NOW()),
('45321098', 'TokenTrooper', '2020-07-14 11:20:00Z', 'TokenTrooper#1234', '0x7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f', NOW()),
('54321098', 'LamboLarry', '2018-04-01 01:04:00Z', 'LamboLarry#5678', '0x8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a', NOW()),
('65432109', 'HODLHelen', '2017-12-25 12:25:00Z', 'HODLHelen#9012', '0x9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b', NOW()),
('76543210', 'MoonshotMike', '2022-06-06 06:06:00Z', 'MoonshotMike#1122', '0x0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c', NOW()),
('87654321', 'YieldYeti', '2023-02-10 10:20:00Z', 'YieldYeti#3344', '0x1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d', NOW()),
('98765432', 'StableSteve', '2021-09-01 00:00:00Z', 'StableSteve#5566', '0x2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e', NOW()),
('19283746', 'ApeAndy', '2022-01-15 15:01:00Z', 'ApeAndy#7788', '0x3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f', NOW()),
('28374651', 'GasGuzzler', '2020-11-20 20:11:00Z', 'GasGuzzler#9900', '0x4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a', NOW()),
('37465129', 'RugpullRon', '2022-05-01 10:05:00Z', 'RugpullRon#1337', '0x5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b', NOW()),
('46512938', 'FUDFrank', '2019-08-08 08:08:00Z', 'FUDFrank#2468', '0x6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c', NOW()),
('51293847', 'FOMOFelicia', '2023-03-03 03:03:00Z', 'FOMOFelicia#8642', '0x7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d', NOW()),
('62938475', 'WhaleWatcher', '2018-07-07 07:07:00Z', 'WhaleWatcher#1357', '0x8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e', NOW()),
('73847562', 'PumpPapi', '2022-09-19 19:09:00Z', 'PumpPapi#2468', '0x9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f', NOW()),
('84756293', 'DumpDiva', '2021-06-16 16:06:00Z', 'DumpDiva#1234', '0x0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a', NOW()),
('95629384', 'CryptoCaren', '2019-03-13 13:03:00Z', 'CryptoCaren#5678', '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b', NOW()),
('16293847', 'VitalikVoter', '2020-02-22 22:22:00Z', 'VitalikFan#9012', '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c', NOW()),
('27384756', 'ProofOfStakePatty', '2022-10-20 12:01:00Z', 'PoSPatty#1122', '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d', NOW()),
('38475629', 'ProofOfWorkPaul', '2018-01-11 11:11:00Z', 'PoWPaul#3344', '0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e', NOW()),
('49562938', 'GweiGwen', '2023-04-14 14:41:00Z', 'GweiGwen#5566', '0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f', NOW()),
('50629384', 'FlashloanFrankie', '2022-12-01 01:12:00Z', 'FlashloanFrankie#7788', '0x6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a', NOW()),
('61738475', 'OracleOwen', '2021-01-31 23:10:00Z', 'OracleOwen#9900', '0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b', NOW()),
('72847561', 'TestnetTina', '2020-08-18 18:08:00Z', 'TestnetTina#1337', '0x8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c', NOW()),
('83956293', 'MainnetMax', '2019-05-25 05:25:00Z', 'MainnetMax#2468', '0x9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d', NOW()),
('94062938', 'ERC20Eddie', '2022-02-28 20:20:00Z', 'ERC20Eddie#8642', '0x0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e', NOW()),
('15173847', 'ERC721Eliza', '2023-05-05 05:05:00Z', 'ERC721Eliza#1357', '0x1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f', NOW()),
('26284756', 'HardforkHarry', '2021-07-17 17:07:00Z', 'HardforkHarry#2468', '0x2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a', NOW()),
('37395629', 'SoftforkSally', '2020-04-04 04:04:00Z', 'SoftforkSally#1234', '0x3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b', NOW()),
('48406293', 'LedgerLeo', '2019-02-12 12:21:00Z', 'LedgerLeo#5678', '0x4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c', NOW()),
('59517384', 'TrezorTanya', '2022-03-23 23:32:00Z', 'TrezorTanya#9012', '0x5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d', NOW()),
('60628475', 'ColdstorageCarl', '2021-11-11 11:11:00Z', 'ColdstorageCarl#1122', '0x6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e', NOW()),
('71739561', 'HotwalletHolly', '2023-06-10 10:06:00Z', 'HotwalletHolly#3344', '0x7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f', NOW()),
('82840629', 'SlippageSonia', '2020-10-30 13:01:00Z', 'SlippageSonia#5566', '0x8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a', NOW()),
('93951738', 'FrontrunFred', '2019-09-09 09:09:00Z', 'FrontrunFred#7788', '0x9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b', NOW());

### **Регистрация нового участника**

```bash
curl -X POST https://the-monicorns-production.up.railway.app/raffle/register \
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
curl -X GET https://the-monicorns-production.up.railway.app/admin/participants \
-H "Authorization: Bearer admin"
```

### **Очистить таблицу участников**

```bash
curl -X DELETE https://the-monicorns-production.up.railway.app/admin/participants \
-H "Authorization: Bearer admin"
```

### **Удалить участника по ID**

Замените `:id` (например, `1`) на реальный ID участника.

```bash
curl -X DELETE https://the-monicorns-production.up.railway.app/admin/participants/1 \
-H "Authorization: Bearer admin"
```

### **Выбрать и назначить победителей**

```bash
curl -X POST https://the-monicorns-production.up.railway.app/admin/winners \
-H "Content-Type: application/json" \
-H "Authorization: Bearer admin" \
-d '{
  "limit": 3
}'
```

### **Очистить таблицу победителей**

```bash
curl -X DELETE https://the-monicorns-production.up.railway.app/admin/winners \
-H "Authorization: Bearer admin"
```

### **Получить список всех победителей**

```bash
curl -X GET https://the-monicorns-production.up.railway.app/admin/winners \
-H "Authorization: Bearer admin"
```

### **Удалить победителя по ID**

Замените `:id` (например, `1`) на реальный ID победителя.

```bash
curl -X DELETE https://the-monicorns-production.up.railway.app/admin/winners/1 \
-H "Authorization: Bearer admin"
```
