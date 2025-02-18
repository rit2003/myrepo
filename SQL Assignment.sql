CREATE DATABASE ecommerce;
USE ecommerce;
CREATE TABLE Customer(
	customer_id INT auto_increment PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(50),
    mobile VARCHAR(15)
);
CREATE TABLE Products(
	id INT auto_increment PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(200),
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50)
);

ALTER TABLE Customer
MODIFY COLUMN name VARCHAR(50) NOT NULL,
MODIFY COLUMN email VARCHAR(50) NOT NULL UNIQUE,
ADD COLUMN age INT;

ALTER TABLE Products
CHANGE COLUMN id product_id INT auto_increment,
MODIFY COLUMN description TEXT;

CREATE TABLE Orderr(
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    product_id INT,
    quantity INT NOT NULL,
    order_date DATE NOT NULL,
    status ENUM('Pending', 'Success', 'Cancel'),
    payment_method ENUM('Credit', 'Debit', 'UPI'),
    total_amount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
);

ALTER TABLE Orderr RENAME TO Orders;
ALTER TABLE Orders MODIFY COLUMN status ENUM('Pending', 'Success', 'Cancel') DEFAULT 'Pending';
ALTER TABLE Orders MODIFY COLUMN payment_method ENUM('Credit', 'Debit', 'UPI', 'COD');
ALTER TABLE Orders ADD FOREIGN KEY (product_id) REFERENCES Products(product_id);

INSERT INTO Customer (name, email, mobile, age) VALUES
('Ritika', 'ritika@gmail.com', '7890276543', 21),
('Palak', 'palak@gmail.com', '9567890134', 28),
('Rohan', 'rohan@gmail.com', '8901212345', 35),
('Priyanshi', 'pri@gmail.com', '9012345678', 40),
('Eva', 'eva@gmail.com', '8906781234', 26),
('Shreeya', 'shree@gmail.com', '6789012345', 33),
('Gracy', 'gracy@gmail.com', '7890123456', 29),
('Heena', 'heena@gmail.com', '8931234567', 31),
('Ivan', 'ivan@gmail.com', '9012345678', 27),
('Tanisha', 'tanisha@gmail.com', '6789123456', 32),
('Karan Lewis', 'karan@gmail.com', '9826099789', 34),
('Lavish', 'lavish@gmail.com', '7897234212', 36),
('Mona', 'mona@gmail.com', '8908923412', 25),
('Nathan', 'nathan@gmail.com', '6234532313', 37),
('Om', 'om@gmail.com', '9856667777', 29),
('Parth', 'parth@gmail.com', '9467778888', 38),
('Reena', 'reena@gmail.com', '7778889999', 30),
('Rachel', 'rachel@gmail.com', '8889990000', 28),
('Sneha', 'sneha@gmail.com', '9990001111', 39),
('Tina', 'tina@gmail.com', '9601112222', 31);


INSERT INTO Products (name, description, price, category) VALUES
('Laptop', 'High performance laptop', 1200.99, 'Electronics'),
('Smartphone', 'Latest model', 799.49, 'Electronics'),
('Headphones', 'Noise-cancelling', 199.99, 'Accessories'),
('Backpack', 'Waterproof', 49.99, 'Fashion'),
('Coffee Maker', 'Automatic machine', 289.99, 'Home Appliances'),
('Gaming Console', 'Next-gen gaming console', 149.99, 'Gaming'),
('Tablet', '10-inch display tablet', 899.99, 'Electronics'),
('Watch', 'Smartwatch fitness tracking', 49.99, 'Accessories'),
('Shoes', 'Running shoes for men', 79.99, 'Fashion'),
('T-shirt', 'Cotton t-shirt', 19.99, 'Fashion'),
('Camera', 'DSLR professional camera', 99.99, 'Electronics'),
('Microwave', '800W oven', 29.99, 'Home Appliances'),
('Desk Chair', 'office chair', 99.99, 'Furniture'),
('Book', 'Bestselling novel', 14.99, 'Books'),
('Sunglasses', 'UV protection sunglasses', 59.99, 'Accessories'),
('Keyboard', 'gaming keyboard', 189.99, 'Electronics'),
('Mouse', 'Wireless mouse', 49.99, 'Electronics'),
('Power Bank', '10000mAh power bank', 39.99, 'Accessories'),
('Speakers', 'Bluetooth portable speakers', 79.99, 'Electronics'),
('Jacket', 'Winter insulated jacket', 49.99, 'Fashion');

INSERT INTO Orders (customer_id, product_id, quantity, order_date, status, payment_method, total_amount) VALUES
(1, 2, 1, '2024-02-01', 'Pending', 'Credit', 799.49),
(2, 3, 2, '2024-02-02', 'Success', 'UPI', 399.98),
(3, 5, 1, '2024-02-03', 'Cancel', 'Debit', 89.99),
(4, 1, 1, '2024-02-04', 'Pending', 'COD', 1200.99),
(5, 4, 3, '2024-02-05', 'Success', 'Credit', 149.97),
(6, 7, 1, '2024-02-06', 'Pending', 'UPI', 299.99),
(7, 10, 2, '2024-02-07', 'Success', 'Debit', 39.98),
(8, 12, 1, '2024-02-08', 'Cancel', 'COD', 129.99),
(9, 15, 1, '2024-02-09', 'Pending', 'Credit', 59.99),
(10, 17, 2, '2024-02-10', 'Success', 'UPI', 99.98);

SELECT category, COUNT(*) AS product_count FROM Products GROUP BY category;
SELECT * FROM Products WHERE category = 'Electronics' AND price BETWEEN 50 AND 500 AND name LIKE '%a%';
SELECT * FROM Products WHERE category = 'Electronics' ORDER BY price DESC LIMIT 5 OFFSET 2;
SELECT * FROM Customer WHERE customer_id NOT IN (SELECT DISTINCT customer_id FROM Orders);
SELECT customer_id, AVG(total_amount) AS avg_spent FROM Orders GROUP BY customer_id;
SELECT * FROM Products WHERE price < (SELECT AVG(price) FROM Products);
SELECT customer_id, SUM(quantity) AS total_quantity FROM Orders GROUP BY customer_id;
SELECT Orders.*, Customer.name AS customer_name, Products.name AS product_name FROM Orders
JOIN Customer ON Orders.customer_id = Customer.customer_id
JOIN Products ON Orders.product_id = Products.product_id;
SELECT * FROM Products WHERE product_id NOT IN (SELECT DISTINCT product_id FROM Orders);




