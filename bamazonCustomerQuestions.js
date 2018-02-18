const inquirer = require("inquirer");
const mysql = require("mysql");
const connection = mysql.createConnection({
	host     : "localhost",
	user     : "root",
	password : "root",
	database : "bamazon_db",
	port: 8889
});

//Walk customer through purchase with inquirer and update DB accordingly
function whichProduct (array, restartFunction) {
	inquirer.prompt([{
		type: "input",
		name: "buyProduct",
		message: "Which product would you like to purchase? (Please enter by ID)",
		validate: function (input) {
			if (isNaN(input) === false && parseInt(input) > 0 && parseInt(input) <= array.length) {
				return true;
			}
			return "Please enter a valid number";
		}
	}]).then( ({buyProduct}) => {
		let purchase;
		for (let i = 0; i < array.length; i++) {
			let element = array[i];
			if (element.id === parseInt(buyProduct)) {
				purchase = element;
			}
        
		}
		console.log("You've chosen " + purchase.product);

		inquirer.prompt([{
			type: "input",
			name: "quant",
			message: "How much would you like to purchase?",
			validate: function (input) {
				if (isNaN(input)) {
					return "Please enter a number";
				}
				else if (isNaN(input) === false && parseInt(input) > 0 && parseInt(input) <= purchase.stock) {
					return true;
				}
				return "Apologies, we only have " + purchase.stock + " available. Please try a smaller amount.";
			}
		}]).then( ({quant}) => {

			let amount = parseInt(quant);
			let cost = purchase.price * amount;
			let addToSales = cost + purchase.sales;
			let newAmount = purchase.stock - amount;
			console.log("Order processed\n=================\n" + 
                    "Purchase: "   + purchase.product + 
                    "\nQuantity: " + amount + 
                    "\nPrice: $"   + cost + 
                    "\n=================");
        
			connection.query("UPDATE bamazon_db.products" + 
                            " SET stock_quantity = ?," +
                            " product_sales = ?" + 
                            " WHERE item_id = ?", [newAmount, addToSales, purchase.id]);

			continueFunc();
			function continueFunc () {
				inquirer.prompt([{
					type: "confirm",
					name: "finalConf",
					message: "Would you like to continue shopping?",
				}]).then( ({finalConf}) => {
					if (finalConf) {
						restartFunction();
					} else {
						connection.end();
						return console.log("Logging off");
					}
				});
			}
            
		});
	});
}

module.exports = whichProduct;