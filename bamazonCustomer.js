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
			let price = element.price;
			productArr.push(element);

			console.log("ID: " + itemId + " | Product: " + productName + " | Price: $" + price);
		
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

			inquirer.prompt([{
				type: "input",
				name: "quant",
				message: "How much would you like to purchase?",
				validate: function (input) {
					if (isNaN(input)) {
						return "Please enter a number";
					}
					else if (isNaN(input) === false && parseInt(input) > 0 && parseInt(input) <= purchase.stock_quantity) {
						return true;
					}
					return "Apologies, we don't have that many available. Please try a smaller amount.";
				}
			}]).then( answers => {

				let amount = answers.quant;
				let cost = purchase.price * amount;
				let addToSales = cost + purchase.product_sales;
				let newAmount = purchase.stock_quantity - amount;
				console.log("Order processed\n=================\nPurchase: " + purchase.product_name + "\nQuantity: " + amount + "\nPrice: $" + cost + "\n=================");
				
				connection.query("UPDATE bamazon_db.products SET stock_quantity = " + newAmount + " WHERE item_id = " + purchase.item_id, () => {

					connection.query("UPDATE bamazon_db.products SET product_sales = " + addToSales + " WHERE item_id = " + purchase.item_id, () => {

						connection.end();
	
					});

				});


			});
		});
	}

	whichProduct();
});