
CREATE DATABASE IF NOT EXISTS techMe_db;
USE techMe_db;


CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image VARCHAR(255),
    category VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    total_amount DECIMAL(10, 2) NOT NULL,
    order_date DATETIME NOT NULL,
    status VARCHAR(20) DEFAULT 'pending'
);


CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);


INSERT INTO products (name, price, image, category, description) VALUES
('iPhone 15 Pro', 999.00, 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693009279096', 'Mobile', 'Latest iPhone with advanced camera system'),
('Samsung Galaxy S23', 799.00, 'https://th.bing.com/th/id/OIP.u-GalyQw5vxygaapZ8XEHQHaEM?cb=iwp2&rs=1&pid=ImgDetMain', 'Mobile', 'Powerful Android smartphone'),
('AirPods Pro', 249.00, 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=572&hei=572&fmt=jpeg&qlt=95&.v=1660803972361', 'Accessories', 'Premium wireless earbuds with ANC'),
('Apple Watch Series 9', 399.00, 'https://th.bing.com/th/id/OIP.Bq7_IeEDjbOaLc7OSTnY5gHaEK?cb=iwp2&rs=1&pid=ImgDetMain', 'Accessories', 'Advanced smartwatch with health features'),
('MacBook Pro 14"', 1599.00, 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-select-202301?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1671304673202', 'Computers', 'Professional laptop with M2 Pro chip'),
('Dell XPS 15', 1499.00, 'https://th.bing.com/th/id/OIP.W8UMLRZmJh5-qd9Y5OyM9QHaEL?cb=iwp2&rs=1&pid=ImgDetMain', 'Computers', 'High-performance Windows laptop');