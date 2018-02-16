const inquirer = require("inquirer");
const mysql = require("mysql");
const CustomerConst = require("./customerConst");
const SuperConst = require("./superConst");
const cTable = require("console.table");
const connection = mysql.createConnection({
	host     : "localhost",
	user     : "root",
	password : "root",
	database : "bamazon_db",
	port: 8889
});
   
connection.connect(function () {
	console.log("Welcome! Here are all the items for sale:");
	startBuy();
});

   
function startBuy (){
	connection.query("SELECT * FROM products", function (error, results) {
		if (error) throw error;

		let custProductArr = [];
		let superProductArr = [];

		function displayGoods (goods) {
			for (let i = 0; i < goods.length; i++) {
				let element = goods[i];
				let itemId = element.item_id;
				let productName = element.product_name;
				let price = element.price;
				let department = element.department_name;
				let stock = element.stock_quantity;
				let sales = element.product_sales;
				let newCustInstance = new CustomerConst(itemId, productName, price);
				let newSuperInstance = new SuperConst(itemId, productName, price, department, stock, sales);
				custProductArr.push(newCustInstance);
				superProductArr.push(newSuperInstance);

			}
			console.table(custProductArr);
		}

		displayGoods(results);

		function whichProduct () {
			inquirer.prompt([{
				type: "input",
				name: "buyProduct",
				message: "Which product would you like to purchase? (Please enter by ID)",
				validate: function (input) {
					if (isNaN(input) === false && parseInt(input) > 0 && parseInt(input) <= superProductArr.length) {
						return true;
					}
					return "Please enter a valid number";
				}
			}]).then( ({buyProduct}) => {
				let purchase;
				for (let i = 0; i < superProductArr.length; i++) {
					let element = superProductArr[i];
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
								" SET stock_quantity = ?" + 
								" WHERE item_id = ?", [newAmount, purchase.id],() => {
						connection.query("UPDATE bamazon_db.products" + 
									" SET product_sales = ?" + 
									" WHERE item_id = ?", [addToSales, purchase.id],() => {
						});
					});

					function continueFunc () {
						inquirer.prompt([{
							type: "confirm",
							name: "finalConf",
							message: "Would you like to continue shopping?",
						}]).then( ({finalConf}) => {

							if (finalConf) {
								startBuy();
							} else {
								connection.end();
								console.log("Logging off");
								return;
							}
						});
					}
					continueFunc();
				});
			});
		}
		whichProduct();
	});
}