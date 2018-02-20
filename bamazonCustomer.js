const mysql = require("mysql");
const CustomerConst = require("./customerConst");
const SuperConst = require("./superConst");
const cTable = require("console.table");
const whichProduct = require("./Questions/bamazonCustomerQuestions");
const connection = mysql.createConnection({
	host     : "localhost",
	user     : "root",
	password : "root",
	database : "bamazon_db",
	port: 8889
});
   
connection.connect(function () {
	console.log("Welcome! Here are all the items for sale:");
	startBuy();
});

//Start Customer prompt and fill Supervisor level and Customer level array objects. Customer array is used to display products to user, ,superisor array is used to update DB
function startBuy (){
	connection.query("SELECT * FROM products", function (error, results) {
		if (error) throw error;
		let custProductArr = [];
		let superProductArr = [];
		function displayGoods (goods) {
			for (let i = 0; i < goods.length; i++) {
				let element = goods[i];
				let itemId = element.item_id;
				let productName = element.product_name;
				let price = element.price;
				let department = element.department_name;
				let stock = element.stock_quantity;
				let sales = element.product_sales;
				let newCustInstance = new CustomerConst(itemId, productName, price);
				let newSuperInstance = new SuperConst(itemId, productName, price, department, stock, sales);
				custProductArr.push(newCustInstance);
				superProductArr.push(newSuperInstance);
			}
			return console.table(custProductArr);
		}
		displayGoods(results);
		whichProduct(superProductArr, startBuy);
	});
}