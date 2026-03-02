# Booktracker DB (PostgreSQL)

Схема відповідає діаграмі `design/DB_Diagram.drawio`. Запуск контейнера створює БД і наповнює її тестовими даними.

## Запуск

```bash
# з кореня проєкту
docker compose up -d

# перевірка
docker compose ps
```

Підключення:

- **Host:** localhost
- **Port:** 5433 (щоб не конфліктувати з локальним PostgreSQL на 5432)
- **DB:** booktracker
- **User:** postgres
- **Password:** postgres

## Підключення (psql)

Якщо підключаєтесь з хоста і бачите «role postgres doesn't exist» — це через те, що `psql` йде на **локальний** PostgreSQL (порт 5432), де часто немає користувача `postgres`. Використовуйте один із варіантів нижче.

**Рекомендовано — через Docker (завжди потрапляєте в контейнер):**

```bash
docker exec -it pdp_postgres psql -U postgres -d booktracker
```

Пароль не потрібен (підключення всередині контейнера).

**З хоста (порт 5433 = контейнер):**

```bash
psql -h localhost -p 5433 -U postgres -d booktracker
# пароль: postgres
```

## Таблиці та дані

| Таблиця          | Опис                                       | Записів (приблизно) |
| ---------------- | ------------------------------------------ | ------------------- |
| users            | Користувачі (user/admin)                   | 6                   |
| books            | Книги                                      | 8                   |
| reading_statuses | Статус читання (planned/reading/completed) | 11                  |
| reviews          | Відгуки (1 на пару user–book)              | 16                  |
| ratings          | Оцінки 1–5 (1 на пару user–book)           | 16                  |
| favorites        | Улюблені (user–book)                       | 10                  |

## Приклади запитів для практики

```sql
-- Книги з середнім рейтингом > 4.3
SELECT title, author, avg_rating, review_count
FROM books
WHERE avg_rating > 4.3
ORDER BY avg_rating DESC;

-- Користувачі-адміни
SELECT id, email, name, role FROM users WHERE role = 'admin';

-- Відгуки з іменами користувачів та назвами книг (JOIN)
SELECT u.name, b.title, r.text, r.created_at
FROM reviews r
JOIN users u ON r.user_id = u.id
JOIN books b ON r.book_id = b.id
ORDER BY r.created_at DESC;

-- Кількість відгуків по книзі (GROUP BY)
SELECT b.title, COUNT(r.id) AS review_count
FROM books b
LEFT JOIN reviews r ON r.book_id = b.id
GROUP BY b.id, b.title
ORDER BY review_count DESC;

-- Книги в статусі "reading" для конкретного користуча (підстав свій user_id)
SELECT b.title, b.author, rs.status, rs.updated_at
FROM reading_statuses rs
JOIN books b ON rs.book_id = b.id
WHERE rs.user_id = 'a0000001-0001-0000-0000-000000000001'
  AND rs.status = 'reading';

-- Улюблені книги користуча з рейтингом
SELECT b.title, b.author, b.avg_rating
FROM favorites f
JOIN books b ON f.book_id = b.id
WHERE f.user_id = 'a0000001-0001-0000-0000-000000000001';

-- Середня оцінка по книзі з таблиці ratings (перевірка з books.avg_rating)
SELECT b.title, AVG(r.value)::numeric(3,2) AS avg_from_ratings
FROM ratings r
JOIN books b ON r.book_id = b.id
GROUP BY b.id, b.title;
```

Після змін у `db/init/` повне пересоздання БД (дані зникнуть):

```bash
docker compose down -v
docker compose up -d
```
