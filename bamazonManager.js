const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");
const managerQuestions = require("./Questions/bamazonManagerQuestions");
let productArr;
const connection = mysql.createConnection({
	host     : "localhost",
	user     : "root",
	password : "root",
	database : "bamazon_db",
	port: 8889
});

connection.connect( function () {
	fillItemArr();
	managerPrompt();
});

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
	}]).then( ({managersChoice}) => {
		switch (managersChoice) {
		case "View products for sale":
			managerQuestions.viewProducts(productArr, managerPrompt);
			break;
		case "View low inventory":
			managerQuestions.viewLowProducts(productArr, managerPrompt);
			break; 
		case "Add to inventory":
			managerQuestions.addToProducts(productArr, managerPrompt, fillItemArr);
			break; 
		case "Add new product":
			managerQuestions.newProduct(managerPrompt, fillItemArr);
			break;
		case "Quit":
			connection.end();
			break; 
		default:
			return "Please choose an option";
		}});
}
