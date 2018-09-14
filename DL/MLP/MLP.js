function MLP(epoches, rate) {
    this.epoches = epoches;
    this.learningRate = rate;
    this.samples = [];
    this.inputNeurons = [];
    this.hiddenNeurons = [];
    this.outputNeuron = new Neuron('O' + 0, true);
    this.connections = [];

    this.init = function(samples,numOfIn, numOfOut) {
    	this.samples = samples;
        this.inputNeurons = [];
        this.hiddenNeurons = [];
    	this.outputNeuron = new Neuron('O' + 0, true);
    	this.connections = [];

        for (var i = 0; i < numOfIn; i++) {
            var inputNeuron = new Neuron('I' + i, false);
            this.inputNeurons.push(inputNeuron);
            for (var j = 0; j < numOfIn; j++) {
                var hiddenNeuron = this.hiddenNeurons[j] ? this.hiddenNeurons[j] : new Neuron('H' + j, true);
                this.hiddenNeurons[j] = hiddenNeuron;
                var connection = new Connection(inputNeuron, hiddenNeuron, 0);
                this.connections.push(connection);
            }
        }

    	for (var i = 0; i < numOfIn; i++) {
    		var hiddenNeuron = this.hiddenNeurons[i];
    		var connection = new Connection(hiddenNeuron, this.outputNeuron, 0);
    		this.connections.push(connection);
    	}	
    }

    this.reset = function() {
        this.samples = [];
        this.inputNeurons = [];
        this.hiddenNeurons = [];
        this.outputNeuron = new Neuron('O' + 0, true);
        this.connections = [];   
    }

    this.learn = function(sender) {
    	var error = true
    	var i = 0
    	while (error && i < this.epoches) {
    	    console.log("epoch # = ",i+1);
    	    error = this.forwardPass(0);
    	    if (!error) {
    	        break;
    	    }
    	    i += 1;
    	    // console.log("epoch # = ",i+1);
    	    // error = this.backwardPass(this.samples.length-1);
    	    // i += 1;
    	}       
    }

    this.forwardPass = function(index) {
        if (index >= this.samples.length) {
            return false;
        }
        var sample = this.samples[index];
        sample.data.forEach(function (x, index, data) {
        	var neuron = this.inputNeurons[index];
        	neuron.input = x;
        }, this);
        this.outputNeuron.desireOutput = sample.desire;
        this.outputNeuron.calculateOutput();
        var error = this.outputNeuron.adjustWeight(this.learningRate);
        error = this.forwardPass(index+1) || error
        return error
    }

    this.backwardPass = function(index) {
        if (index < 0) {
            return false;
        }
        var sample = this.samples[index];
        sample.data.forEach(function (x, index, data) {
        	var neuron = this.inputNeurons[index];
        	neuron.input = x;
        }, this);
        this.outputNeuron.desireOutput = sample.desire;
        this.outputNeuron.calculateOutput();
        var error = this.outputNeuron.adjustWeight(this.learningRate);
        error = this.backwardPass(index-1) || error
        return error
    }

    this.test = function(sample) {
        sample.data.forEach(function (x, index, data) {
            var neuron = this.inputNeurons[index];
            neuron.input = x;
        }, this);
        return this.outputNeuron.calculateOutput() > 0 ? 1 : -1;
    }
}