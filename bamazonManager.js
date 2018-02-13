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
connection.query("SELECT * FROM products", function (error, results) {
	if (error) throw error;
	for (let i = 0; i < results.length; i++) {
		let element = results[i];
		productArr.push(element);
	}
});
connection.end();

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
		for (let i = 0; i < productArr.length; i++) {
			let allInv = productArr[i];
			console.log("ID: " + allInv.item_id + " | Product: " + allInv.product_name + " | Department: " + allInv.product_name + " | Price: $" + allInv.price + " | Stock: " + allInv.stock_quantity);
		}

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

	}});
        

        
// 	case "View low inventory":
// 		connection.connect();
// 		connection.query("SELECT * FROM products", function (error, results) {
// 			if (error) throw error;

// 			console.log("Manager View\n============\nItems for sale:");

// 			function displayGoods (goods) {
// 				for (let i = 0; i < goods.length; i++) {
// 					let element = goods[i];
// 					let itemId = element.item_id;
// 					let productName = element.product_name;
// 					let departmentName = element.department_name;
// 					let price = element.price;
// 					let quantity = element.stock_quantity;
// 					if (quantity < 5) {
// 						console.log("ID: " + itemId + " | Product: " + productName + " | Department: " + departmentName + " | Price: $" + price + " | Stock: " + quantity);
// 					}
// 				}
// 			}

// 			displayGoods(results);

// 		});
// 		connection.end();
// 		break;
        
// 	case "Add to inventory":
// 		connection.connect();
        
//         connection.query("SELECT * FROM products", function (error, results) {
// 			if (error) throw error;
//             displayGoods(results);
        
// 		inquirer.prompt([{
// 			type: "list",
// 			name: "managersChoice",
// 			message: "Which item would you like to add to (please enter item id):",
// 			validate: function (input) {
// 				if (isNaN(input) === false && parseInt(input) > 0 && parseInt(input) <= productArr.length) {
// 					return true;
// 				}
// 				return "Please enter a valid number";
// 			}
// 		}]).then( answers => {
// 			console.log(answers);
// 		});

// 		connection.query("UPDATE bamazon_db.products SET stock_quantity = " + newAmount + " WHERE item_id = " + purchase.item_id, (error, results) => {
// 			if (error) throw error;

// 			console.log("Manager View\n============\nItems for sale:");

// 			function displayGoods (goods) {
// 				for (let i = 0; i < goods.length; i++) {
// 					let element = goods[i];
// 					let itemId = element.item_id;
// 					let productName = element.product_name;
// 					let departmentName = element.department_name;
// 					let price = element.price;
// 					let quantity = element.stock_quantity;
// 					if (quantity < 5) {
// 						console.log("ID: " + itemId + " | Product: " + productName + " | Department: " + departmentName + " | Price: $" + price + " | Stock: " + quantity);
// }
// }
// }

// 			displayGoods(results);

// });
// 		connection.end();
// 		// break;
        
	

    
// });

// function displayGoods (goods) {
// 	for (let i = 0; i < goods.length; i++) {
// 		let element = goods[i];
// 		let itemId = element.item_id;
// 		let productName = element.product_name;
// 		let departmentName = element.department_name;
// 		let price = element.price;
// 		let quantity = element.stock_quantity;

// 		console.log("ID: " + itemId + " | Product: " + productName + " | Department: " + departmentName + " | Price: $" + price + " | Stock: " + quantity);

// 	}
// }



// Add to Inventory
// Add New Product
// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store