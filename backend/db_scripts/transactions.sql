CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INT FOREIGN KEY()
    item VARCHAR(255) NOT NULL,
    amount NUMERIC(10, 2),
    category VARCHAR(255) NOT NULL,
    created_at DATETIME
);