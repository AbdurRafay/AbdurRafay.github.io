function Neuron(name, activate) {
    this.label = name;
    this.input = 0.0;
    this.output = 0.0;
    this.desireOutput = 0.0;
    this.sum = 0.0;
    this.inConnections = [];
    this.outConnections = [];
    this.shouldActivate = activate;
    this.error = 0.0;
    
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
    	this.output = this.shouldActivate ? (1.0 / (1.0 + Math.exp(-this.sum))) : this.sum;
    }

    this.adjustWeight = function(learningRate) {
        this.calculateOutputError();
        this.inConnections.forEach(function(connection, index, connections) {
            connection.from.calculateHiddenError();
        }, this);
        if (this.error == 0) {
            return this.error != 0.0;
        }
        this.inConnections.forEach(function(connection, index, connections) {
            connection.weight += learningRate * connection.to.error * connection.from.output;
            connection.from.inConnections.forEach(function(connection, index, connections) {
                connection.weight += learningRate * connection.to.error * connection.from.output;
            }, this);
        }, this);
        return true;
    }

    this.calculateOutputError = function() {
        this.error = (this.output) * (1.0 - this.output) * (this.desireOutput - this.output);
        return this.error != 0.0
    }

    this.calculateHiddenError = function() {
        var errorSum = 0.0;
        this.outConnections.forEach(function(connection, index, connections) {
            errorSum += connection.to.error * connection.getWeight();
        }, this);
        this.error = (this.output) * ( 1.0 - this.output) * errorSum;
        return this.error != 0.0;
    }
}