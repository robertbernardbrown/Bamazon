class CustomerConst {
	constructor(id, product, price) {
		this.id      = id;
		this.product = product;
		this.price   = "$" + parseInt(price);
	}
}

module.exports = CustomerConst;