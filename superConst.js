class SuperConst {
	constructor(id, product, price, department, stock, sales) {
		this.id         = id;
		this.product    = product;
		this.price      = parseInt(price);
		this.department = department;
		this.stock      = parseInt(stock);
		this.sales      = parseInt(sales);
	}
}

module.exports = SuperConst;