const inquirer = require("inquirer");
const mysql = require("mysql");
let productArr = [];
const connection = mysql.createConnection({
	host     : "localhost",
	user     : "root",
	password : "root",
	database : "bamazon_db",
	socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock"
});

connection.connect();
fillItemArr();
managerPrompt();

function fillItemArr () {
	productArr = [];
	connection.query("SELECT * FROM products", function (error, results) {
		if (error) throw error;
		for (let i = 0; i < results.length; i++) {
			let element = results[i];
			productArr.push(element);
		}
	});
}

function managerPrompt () {

	function displayGoods (arr) {
		for (var i = 0; i < arr.length; i++) {
			var inventory = arr[i];
			console.log("ID: " + inventory.item_id + " | Product: " + inventory.product_name + " | Department: " + inventory.product_name + " | Price: $" + inventory.price + " | Stock: " + inventory.stock_quantity);
		}
	}

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
			console.log("Manager View\n============\nItems for sale:");
			displayGoods(productArr);
			break;
            
		case "View low inventory":
			console.log("Manager View\n============\nLow Inventory:");
			for (let j = 0; j < productArr.length; j++) {
				let lowInv = productArr[j];
				if (lowInv.stock_quantity < 5) {
					console.log("ID: " + lowInv.item_id + " | Product: " + lowInv.product_name + " | Department: " + lowInv.product_name + " | Price: $" + lowInv.price + " | Stock: " + lowInv.stock_quantity);
				}
			}
			break;
            
		case "Add to inventory":
			displayGoods(productArr);
			inquirer.prompt([{
				type: "input",
				name: "managersChoice",
				message: "To which item would you like to add (please enter item id):",
				validate: function (input) {
					if (isNaN(input) === false && parseInt(input) > 0 && parseInt(input) <= productArr.length) {
						return true;
					}
					return "Please enter a valid number";
				}
			}]).then( answers => {

				let choice = parseInt(answers.managersChoice);
                
				inquirer.prompt([{
					type: "input",
					name: "managersAmount",
					message: "How much inventory would you like to add:",
					validate: function (input) {
						if (isNaN(input) === false) {
							return true;
						}
						return "Please enter a valid number";
					}
				}]).then( answers => {

					let item = productArr[choice - 1];
					let choiceAmount = parseInt(answers.managersAmount);
					let newAmount = choiceAmount + item.stock_quantity;
                    
					connection.query("UPDATE bamazon_db.products SET stock_quantity = " + newAmount + " WHERE item_id = " + choice, (error) => {
						if (error) throw error;
						console.log("Command processed\n=================\nItem: " + item.product_name + "\nNew quantity: " + newAmount + "\n=================");
						connection.end();
					});
				});
                
			});
        
			break;
            
		case "Add new product":
        
			break;
		}});
}

// Add New Product
// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store