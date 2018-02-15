const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");
let productArr;
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
    
	function newProduct () {
		inquirer.prompt([{
			type: "input",
			name: "productName",
			message: "Please enter the name of the product you would like to add:",
		}]).then( answers => {

			let brandNewItem = answers.productName;
                
			inquirer.prompt([{
				type: "input",
				name: "productCost",
				message: "Please enter a price for this product:",
				validate: function (input) {
					if (isNaN(input) === false) {
						return true;
					}
					return "Please enter a valid number";
				}
			}]).then( answers => {
    
				let brandNewItemCost = parseInt(answers.productCost);
                    
				inquirer.prompt([{
					type: "input",
					name: "productStock",
					message: "Please enter the quantity for this product:",
					validate: function (input) {
						if (isNaN(input) === false) {
							return true;
						}
						return "Please enter a valid number";
					}
				}]).then( answers => {
        
					let brandNewItemQuant = parseInt(answers.productStock);
                        
					inquirer.prompt([{
						type: "list",
						name: "productDept",
						message: "Finally, please enter a department for this product:",
						choices: [
							"Produce",
							"Poultry",
							"Dry Goods",
							"Desserts",
							"Frozen"
						]
					}]).then( answers => {
            
						let brandNewItemDept = answers.productDept;
                        
						console.log("Product draft:\n==============\n" + 
						"Product Name: " + brandNewItem + 
						"\nCost: " 	 	 + brandNewItemCost + 
						"\nStock: " 	 + brandNewItemQuant + 
						"\nDepartment: " + brandNewItemDept + "\n==============");
            
						inquirer.prompt([{
							type: "confirm",
							name: "newProductConfirm",
							message: "Is everything correct?",
						}]).then( answers => {
                
							let brandNewItemConfirm = answers.newProductConfirm;
							let brandNewItemSales = 0;

							if (brandNewItemConfirm) {
								connection.query("INSERT INTO bamazon_db.products" + 
												" SET product_name = ?, department_name = ?, price = ?, stock_quantity = ?, product_sales = ?", 
								[brandNewItem, brandNewItemDept, brandNewItemCost ,brandNewItemQuant, brandNewItemSales], 
								(error) => {
									if (error) throw error;
									console.log("New product processed");
									fillItemArr();
									managerPrompt();
								});

							} else {
								newProduct();
							}
                            
						});

					});
        
				});
    
			});

		});
	}

	inquirer.prompt([{
		type: "list",
		name: "managersChoice",
		message: "Please choose an action (or click CTL->C to exit):",
		choices: [
			"View products for sale",
			"View low inventory",
			"Add to inventory",
			"Add new product",
			"Quit",
		]
	}]).then( answers => {

		let input = answers.managersChoice;
    
		switch (input) {
		case "View products for sale":
			console.log("Manager View\n============\nItems for sale:");
			console.table(productArr);
			managerPrompt();
			break;
            
		case "View low inventory":
			console.log("Manager View\n============\nLow Inventory:");
			var lowInv = [];
			for (let j = 0; j < productArr.length; j++) {
				if (productArr[j].stock_quantity < 5) {
					lowInv.push(productArr[j]);
				}
			}
			console.table(lowInv);
			managerPrompt();
			break;
            
		case "Add to inventory":
			console.table(productArr);
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
                    
					connection.query("UPDATE bamazon_db.products" + 
									" SET stock_quantity = ?" + 
									" WHERE item_id = ?" 
						,[newAmount, choice],(error) => {
						if (error) throw error;
						console.log("Command processed\n=================\n" + 
									"Item: " 		   + item.product_name + 
									"\nNew quantity: " + newAmount + 
									"\n=================");
						fillItemArr();
						managerPrompt();
					});
				});
                
			});
			break;
            
		case "Add new product":
        
			newProduct();
			break;

		case "Quit":
        
			connection.end();
			break;
            
		default:
			return "Please choose an option";
		}});
}
