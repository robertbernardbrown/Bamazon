const inquirer = require("inquirer");
const mysql = require("mysql");

var connection = mysql.createConnection({
	host     : "localhost",
	user     : "root",
	password : "root",
	database : "bamazon_db",
	socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock"
});
   
connection.connect();
   
connection.query("SELECT * FROM products", function (error, results) {
	if (error) throw error;

	console.log("Welcome! Here are all the items for sale:");
	for (var i = 0; i < results.length; i++) {
		var element = results[i];
		var itemId = element.item_id;
		var productName = element.product_name;
		var departmentName = element.department_name;
		var price = element.price;
		var quantity = element.stock_quantity;

		console.log("ID: " + itemId + " | Product: " + productName + " | Department: " + departmentName + " | Price: $" + price + " | Stock:" + quantity);
		
	}

});
   
connection.end();