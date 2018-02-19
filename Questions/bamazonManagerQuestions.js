const inquirer = require("inquirer");
const mysql = require("mysql");
const connection = mysql.createConnection({
	host     : "localhost",
	user     : "root",
	password : "root",
	database : "bamazon_db",
	port: 8889
});

function newProduct (managerPrompt, fillItemArr) {
	let deptArr = [];
	connection.query("SELECT departments.department_name FROM departments GROUP BY department_name ORDER BY department_name asc", 
		(error, results) => {
			if (error) throw error;
			for (let i = 0; i < results.length; i++) {
				let element = results[i].department_name;
				deptArr.push(element);
			}
		});

	inquirer.prompt([
		{
			type: "input",
			name: "productName",
			message: "Please enter the name of the product you would like to add:",
		},
		{
			type: "input",
			name: "productCost",
			message: "Please enter a price for this product:",
			validate: function (input) {
				if (isNaN(input) === false) {
					return true;
				}
				return "Please enter a valid number";
			}
		},
		{
			type: "input",
			name: "productStock",
			message: "Please enter the quantity for this product:",
			validate: function (input) {
				if (isNaN(input) === false) {
					return true;
				}
				return "Please enter a valid number";
			}
		},
		{
			type: "list",
			name: "productDept",
			message: "Finally, please enter a department for this product:",
			choices: deptArr
		}
	]).then( answers => {
		let brandNewItem = answers.productName;
		let brandNewItemCost = parseInt(answers.productCost);        
		let brandNewItemQuant = parseInt(answers.productStock);            
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
}

function viewProducts (arr, managerPrompt) {
	console.log("Manager View\n============\nItems for sale:");
	console.table(arr);
	managerPrompt();
}

function viewLowProducts (arr, managerPrompt) {
	console.log("Manager View\n============\nLow Inventory:");
	var lowInv = [];
	for (let j = 0; j < arr.length; j++) {
		if (arr[j].stock_quantity < 5) {
			lowInv.push(arr[j]);
		}
	}
	console.table(lowInv);
	managerPrompt();
}

function addToProducts (arr, managerPrompt, fillItemArr) {
	console.table(arr);
	inquirer.prompt([
		{
			type: "input",
			name: "managersChoice",
			message: "To which item would you like to add (please enter item id):",
			validate: function (input) {
				if (isNaN(input) === false && parseInt(input) > 0 && parseInt(input) <= arr.length) {
					return true;
				}
				return "Please enter a valid number";
			}
		},
		{
			type: "input",
			name: "managersAmount",
			message: "How much inventory would you like to add:",
			validate: function (input) {
				if (isNaN(input) === false) {
					return true;
				}
				return "Please enter a valid number";
			}
		}
	]).then( answers => {

		let choice = parseInt(answers.managersChoice);
		let item = arr[choice - 1];
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
}

module.exports = {
	newProduct: newProduct,
	viewProducts: viewProducts,
	viewLowProducts: viewLowProducts,
	addToProducts: addToProducts
};