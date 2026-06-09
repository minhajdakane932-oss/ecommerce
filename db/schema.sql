CREATE DATABASE IF NOT EXISTS clothes_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE clothes_shop;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  is_admin TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

INSERT INTO products (name, description, price, image_url) VALUES
('Minimalist Denim Jacket', 'A versatile denim jacket for everyday wear.', 69.99, 'https://images.unsplash.com/photo-1520975911959-c1932b6b4891?auto=format&fit=crop&w=900&q=80'),
('Soft Knit Sweater', 'Cozy knit sweater with a relaxed fit.', 49.99, 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80'),
('Sleek Black Dress', 'A modern black dress perfect for evenings out.', 79.99, 'https://images.unsplash.com/photo-1463100099107-aa0980c362e6?auto=format&fit=crop&w=900&q=80');
