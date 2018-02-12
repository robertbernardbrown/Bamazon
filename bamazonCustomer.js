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

	console.log("Welcome! Here are all the items for sale:");
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

	function whichProduct () {
		inquirer.prompt([{
			type: "input",
			name: "buyProduct",
			message: "Which product would you like to purchase? (Please enter by ID)",
			validate: function (input) {
				if (isNaN(input) === false && parseInt(input) > 0 && parseInt(input) <= productArr.length) {
					return true;
				}
				return "Please enter a valid number";
			}
		}]).then( answers => {

			let purchase;
			for (let i = 0; i < productArr.length; i++) {
				let element = productArr[i];
				if (element.item_id === parseInt(answers.buyProduct)) {
					purchase = element;
				}
				
			}
			console.log("You've chosen " + purchase.product_name);

		});
	}

	whichProduct();

});
   
connection.end();