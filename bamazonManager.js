const inquirer = require("inquirer");
const mysql = require("mysql");

const connection = mysql.createConnection({
	host     : "localhost",
	user     : "root",
	password : "root",
	database : "bamazon_db",
	socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock"
});
   
connection.connect();
   
connection.query("SELECT * FROM products", function (error, results) {
	if (error) throw error;

	console.log("Manager View. Items for sale:");
	var productArr = [];

	function displayGoods (goods) {
		for (let i = 0; i < goods.length; i++) {
			let element = goods[i];
			let itemId = element.item_id;
			let productName = element.product_name;
			let departmentName = element.department_name;
			let price = element.price;
			let quantity = element.stock_quantity;
			productArr.push(element);

			console.log("ID: " + itemId + " | Product: " + productName + " | Department: " + departmentName + " | Price: $" + price + " | Stock: " + quantity);
		
		}
	}

	displayGoods(results);

});

connection.end();

// List a set of menu options:
// View Products for Sale
// View Low Inventory
// Add to Inventory
// Add New Product
// If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
// If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.