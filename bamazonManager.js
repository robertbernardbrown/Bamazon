const inquirer = require("inquirer");
const mysql = require("mysql");

const connection = mysql.createConnection({
	host     : "localhost",
	user     : "root",
	password : "root",
	database : "bamazon_db",
	socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock"
});

inquirer.prompt([{
	type: "list",
	name: "managersChoice",
	message: "Please choose an action:",
	choices: [
		"View products for sale",
		"View low inventory",
		"Add to inventory",
		"Add new product"
	]
}]).then( answers => {

	let input = answers.managersChoice;
    
	switch (input) {

	case "View products for sale":
		connection.connect();
		connection.query("SELECT * FROM products", function (error, results) {
			if (error) throw error;

			console.log("Manager View\n============\nItems for sale:");
            
			function displayGoods (goods) {
				for (let i = 0; i < goods.length; i++) {
					let element = goods[i];
					let itemId = element.item_id;
					let productName = element.product_name;
					let departmentName = element.department_name;
					let price = element.price;
					let quantity = element.stock_quantity;

					console.log("ID: " + itemId + " | Product: " + productName + " | Department: " + departmentName + " | Price: $" + price + " | Stock: " + quantity);
            
				}
			}

			displayGoods(results);

		});
		connection.end();
		break;
        
	case "View low inventory":
		connection.connect();
		connection.query("SELECT * FROM products", function (error, results) {
			if (error) throw error;

			console.log("Manager View\n============\nItems for sale:");

			function displayGoods (goods) {
				for (let i = 0; i < goods.length; i++) {
					let element = goods[i];
					let itemId = element.item_id;
					let productName = element.product_name;
					let departmentName = element.department_name;
					let price = element.price;
					let quantity = element.stock_quantity;
					if (quantity < 5) {
						console.log("ID: " + itemId + " | Product: " + productName + " | Department: " + departmentName + " | Price: $" + price + " | Stock: " + quantity);
					}
				}
			}

			displayGoods(results);

		});
		connection.end();
		break;
        
	case "Add to inventory":
		connection.connect();
		connection.query("SELECT * FROM products", function (error, results) {
			if (error) throw error;

			console.log("Manager View\n============\nItems for sale:");

			function displayGoods (goods) {
				for (let i = 0; i < goods.length; i++) {
					let element = goods[i];
					let itemId = element.item_id;
					let productName = element.product_name;
					let departmentName = element.department_name;
					let price = element.price;
					let quantity = element.stock_quantity;
					if (quantity < 5) {
						console.log("ID: " + itemId + " | Product: " + productName + " | Department: " + departmentName + " | Price: $" + price + " | Stock: " + quantity);
					}
				}
			}

			displayGoods(results);

		});
		connection.end();
		break;
        
	case "Add new product":
	}

    
});



// Add to Inventory
// Add New Product
// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.