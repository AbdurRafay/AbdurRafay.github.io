function Neuron(activate) {
    this.input = 0.0;
    this.output = 0.0;
    this.desireOutput = 0.0;
    this.sum = 0.0;
    this.inConnections = [];
    this.outConnections = [];
    this.shouldActivate = activate;
    
    this.addInLink = function(connection) {
    	this.inConnections.push(connection);
    }

	this.addOutLink = function(connection) {
    	this.outConnections.push(connection);
    }
    
    this.calculateOutput = function() {
    	this.weightedSum();
    	this.activate();
    	return this.output;
    }

    this.weightedSum = function() {
    	this.sum = this.input;
    	this.inConnections.forEach(function(connection, index, connections) {
    		this.sum += connection.weight*connection.from.calculateOutput();
    	}, this);
    }    

    this.activate = function() {
    	this.output = this.shouldActivate ? this.sum > 0 ? 1 : -1 : this.sum;
    }

    this.adjustWeight = function(learningRate) {
		var c = this.desireOutput - this.output;
        var factor = c * learningRate;
        this.inConnections.forEach(function(connection, index, connections) {
    		connection.weight += factor * connection.from.output;
    	}, this);
        return c != 0
    }
}