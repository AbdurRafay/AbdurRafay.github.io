function Connection(f, t, w) {
	this.from = f;
	this.to = t;
	this.weight = w;
	this.from.addOutLink(this);
	this.to.addInLink(this);

	this.getWeight = function() {
		return this.weight;
	}
}