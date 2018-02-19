const inquirer = require("inquirer");
const mysql = require("mysql");
const connection = mysql.createConnection({
	host     : "localhost",
	user     : "root",
	password : "root",
	database : "bamazon_db",
	port: 8889
});

function newDeptFunc(supervisorPrompt) {
	inquirer.prompt([
		{
			type: "input",
			name: "newDept",
			message: "What's the name of the new department:",
		},
		{
			type: "input",
			name: "overHead",
			message: "What's our over head cost of this department:",
			validate: function (input) {
				if (isNaN(input) === false) {
					return true;
				}
				return "Please enter a valid number";
			}
		}
	]).then(answers => {

		let newDept = answers.newDept;
		let overHead = answers.overHead;
        
		console.log("New Department: " + newDept + "\nOverhead Cost: " + overHead);

		inquirer.prompt([{
			type: "confirm",
			name: "confirm",
			message: "Does everything look correct?",
		}]).then(({confirm}) => {

			if (confirm) {
				console.log("New department created");
				connection.query("INSERT INTO bamazon_db.departments" +
                    " SET department_name = ?," +
                    " over_head_costs = ?", [newDept, overHead],
				(error) => {
					if (error) throw error;
				});
                
				supervisorPrompt();

			} else {
				newDeptFunc();
			}
		});
	});
}

function viewProductSales(supervisorPrompt) {
	connection.query("SELECT departments.department_id as Department_ID, products.department_name as Departments, departments.over_head_costs as Over_Head_Costs, SUM(products.product_sales) as Sales, (SUM(products.product_sales) - departments.over_head_costs) AS Total_Profit" +
                " FROM products" +
                " INNER JOIN departments ON products.department_name = departments.department_name" +
                " GROUP BY Departments" +
                " ORDER BY Department_ID asc",
	(error, res) => {
		if (error) throw error;
		console.table(res);
		supervisorPrompt();
	});
}

module.exports = {
	newDeptFunc: newDeptFunc,
	viewProductSales: viewProductSales,
};