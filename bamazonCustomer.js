const inquirer = require("inquirer");
const mysql = require("mysql");

var connection = mysql.createConnection({
	host     : "localhost",
	user     : "root",
	password : "root",
	database : "bamazon_db",
	socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock"
});
   
connection.connect();
   
connection.query("SELECT * FROM products", function (error, results) {
	if (error) throw error;
	console.log("Data received from Db:\n");
	console.log(results);
});
   
connection.end();