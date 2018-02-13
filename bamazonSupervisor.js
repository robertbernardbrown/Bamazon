const inquirer = require("inquirer");
const mysql = require("mysql");

supervisorPrompt();

function supervisorPrompt () {
	inquirer.prompt([{
		type: "list",
		name: "supervisorInitial",
		message: "Please choose an action:",
		choices: [
			"View product sales by department",
			"Create new department",
		]
	}]).then( answers => {

		console.log(answers);

	});
}