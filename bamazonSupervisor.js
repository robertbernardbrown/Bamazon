const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");
const connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "root",
	database: "bamazon_db",
	port: 8889
});

connection.connect();

function newDeptFunc() {
	inquirer.prompt([{
		type: "input",
		name: "newDept",
		message: "What's the name of the new department:",
	}]).then(answers => {

		let newDept = answers.newDept;

		inquirer.prompt([{
			type: "input",
			name: "overHead",
			message: "What's our over head cost of this department:",
			validate: function (input) {
				if (isNaN(input) === false) {
					return true;
				}
				return "Please enter a valid number";
			}
		}]).then(answers => {

			let overHead = answers.overHead;
			console.log("New Department: " + newDept +
				"\nOverhead Cost: " + overHead);

			inquirer.prompt([{
				type: "confirm",
				name: "confirm",
				message: "Does everything look correct?",
			}]).then(answers => {

				let confirmation = answers.confirm;

				if (confirmation) {
					console.log("New department created");
					connection.query("INSERT INTO bamazon_db.departments" +
						" SET department_name = ?," +
						" over_head_costs = ?", [newDept, overHead],
					function (error) {
						if (error) throw error;
					});

					supervisorPrompt();

				} else {
					newDeptFunc();
				}

			});

		});

	});
}

supervisorPrompt();

function supervisorPrompt() {
	inquirer.prompt([{
		type: "list",
		name: "supervisorInitial",
		message: "Please choose an action (Or CTR->C to quit):",
		choices: [
			"View product sales by department",
			"Create new department",
			"Quit"
		]
	}]).then(answers => {

		let supervisorChoice = answers.supervisorInitial;

		switch (supervisorChoice) {

		case "View product sales by department":

			connection.query("SELECT departments.department_id as Department_ID, products.department_name as Departments, departments.over_head_costs as Over_Head_Costs, SUM(products.product_sales) as Sales, (SUM(products.product_sales) - departments.over_head_costs) AS Total_Profit" +
					" FROM products" +
					" INNER JOIN departments ON products.department_name = departments.department_name" +
					" GROUP BY Departments" +
					" ORDER BY Department_ID asc",
			function (error, res) {
				if (error) throw error;
				console.table(res);
				supervisorPrompt();
			});
			break;

		case "Create new department":
			newDeptFunc();
			supervisorPrompt();
			break;

		case "Quit":
			connection.end();
			break;

		default:
			"Please choose a valid option";
		}
	});
}