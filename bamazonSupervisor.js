const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");
const supervisorQuestions = require("./Questions/bamazonSupervisorQuestions");
const connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "root",
	database: "bamazon_db",
	port: 8889
});

connection.connect(function() {
	supervisorFunc();
});

function supervisorFunc () {

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
				supervisorQuestions.viewProductSales(supervisorPrompt);
				break;
			case "Create new department":
				supervisorQuestions.newDeptFunc(supervisorPrompt);
				break;
			case "Quit":
				connection.end();
				break;
			default:
				"Please choose a valid option";
			}
		});
	}
}