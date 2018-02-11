DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
	item_id INTEGER(10) AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(30),
    department_name VARCHAR(30),
    price INTEGER(10),
    stock_quantity INTEGER (10),
    PRIMARY KEY(item_id)
);

SELECT * FROM bamazon_db.products;

INSERT INTO bamazon_db.products (product_name, department_name, price, stock_quantity)
VALUES 
("Bananas", "Produce", 3, 10),
("Chicken", "Poultry", 7, 8),
("Hot Cheetos", "Dry Goods", 2, 9),
("Broccoli", "Produce", 3, 10),
("Ice Cream", "Desserts", 4, 8),
("Pizza", "Frozen", 7, 5),
("Peppers", "Produce", 2, 3),
("Avocados", "Produce", 8, 1),
("Milk", "Dairy", 3, 10),
("Cereal", "Dry Goods", 3, 10);

DELETE FROM bamazon_db.products WHERE product_name = null
