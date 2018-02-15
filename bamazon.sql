DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
	item_id INTEGER(10) AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(30),
    department_name VARCHAR(30),
    price INTEGER(10),
    stock_quantity INTEGER (10),
	product_sales INTEGER (10),
    PRIMARY KEY(item_id)
);

INSERT INTO bamazon_db.products (product_name, department_name, price, stock_quantity, product_sales)
VALUES 
("Bananas", "Produce", 3, 10, 0),
("Chicken", "Poultry", 7, 8, 0),
("Hot Cheetos", "Dry Goods", 2, 9, 0),
("Broccoli", "Produce", 3, 10, 0),
("Ice Cream", "Desserts", 4, 8, 0),
("Pizza", "Frozen", 7, 5, 0),
("Peppers", "Produce", 2, 3, 0),
("Avocados", "Produce", 8, 1, 0),
("Milk", "Dairy", 3, 10, 0),
("Cereal", "Dry Goods", 3, 10, 0);

CREATE TABLE departments (
	department_id INTEGER(10) AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(30),
    over_head_costs INTEGER(10),
    PRIMARY KEY(department_id)
);

INSERT INTO bamazon_db.departments (department_name, over_head_costs)
VALUES 
("Produce", 30),
("Poultry", 22),
("Dry Goods", 70),
("Desserts", 15),
("Frozen", 300),
("Dairy", 10);

/*SELECT departments.department_id, products.department_name, departments.over_head_costs, products.product_sales, (products.product_sales - departments.over_head_costs) AS total_profit
FROM products
INNER JOIN departments ON products.department_name = departments.department_name
GROUP BY department_name
ORDER BY department_id asc*/

SELECT * FROM products;