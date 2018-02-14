const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");
const connection = mysql.createConnection({
	host     : "localhost",
	user     : "root",
	password : "root",
	database : "bamazon_db",
	socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock"
});

supervisorPrompt();

function supervisorPrompt () {
	connection.connect();
	inquirer.prompt([{
		type: "list",
		name: "supervisorInitial",
		message: "Please choose an action:",
		choices: [
			"View product sales by department",
			"Create new department",
		]
	}]).then( answers => {

		let supervisorChoice = answers.supervisorInitial;
		let query;

		switch (supervisorChoice) {

		case "View product sales by department":

			query = connection.query("SELECT departments.department_id, products.department_name, departments.over_head_costs, products.product_sales, (products.product_sales - departments.over_head_costs) AS total_profit" 
									+ " FROM products"
									+ " INNER JOIN departments ON products.department_name = departments.department_name"
									+ " GROUP BY department_name"
									+ " ORDER BY department_id asc"
				, function (error, res) {
				if (error) throw error;
				console.table(res);
			});
			break;

		case "Create new department":
			console.log("hi");
			break;

		case "Quit":
			connection.end();
			break;

		default:
			"Please choose a valid option";
		}
	});
}