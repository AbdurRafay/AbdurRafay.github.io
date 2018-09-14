function Canvas (idCanvas) {
	this.canvas = document.getElementById(idCanvas);
	this.ctx = this.canvas.getContext("2d");
	// this.kWidth = Math.min(this.canvas.clientWidth, this.canvas.clientHeight);
	// this.kHeight = this.kWidth;
	this.kWidth = this.canvas.clientWidth;
	this.kHeight = this.canvas.clientHeight;
	this.kOriginX = this.kWidth / 2;
	this.kOriginY = this.kHeight / 2;
	this.kGraphTop = kOffsetY;
	this.kGraphBottom = this.kHeight - kOffsetY;
	this.kGraphLeft = kOffsetX;
	this.kGraphRight = this.kWidth - kOffsetX;
	this.maxAxis =  ((this.kWidth - (kOffsetX*2)) / kUnitAxis)/2;

	this.canvas.width = this.kWidth;
	this.canvas.height = this.kHeight;
	this.canvas.style.width = this.kWidth + 'px';
	this.canvas.style.height = this.kHeight + 'px';
	
	
	this.drawAxis = function() {
		this.ctx.lineWidth = 1.0;
		this.ctx.strokeStyle ='black';	

		for (var i = 0; i <= this.maxAxis; i++) {
			// vertical
			var topRight = { 'x':  this.kOriginX + i * kUnitAxis, 'y': this.kGraphTop }
			var bottomRight = { 'x':  this.kOriginX + i * kUnitAxis, 'y': this.kGraphBottom }
			this.ctx.moveTo(topRight.x, topRight.y);
			this.ctx.lineTo(bottomRight.x, bottomRight.y)
			var topLeft = { 'x':  this.kOriginX + i * -1 * kUnitAxis, 'y': this.kGraphTop }
			var bottomLeft = { 'x':  this.kOriginX + i * -1 * kUnitAxis, 'y': this.kGraphBottom }
			this.ctx.moveTo(topLeft.x, topLeft.y)
			this.ctx.lineTo(bottomLeft.x, bottomLeft.y)
			
			// horizontal
			var leftTop = { 'x': topRight.y, 'y': topRight.x }
			var rightTop = { 'x': bottomRight.y, 'y': bottomRight.x }
			this.ctx.moveTo(leftTop.x, leftTop.y)
			this.ctx.lineTo(rightTop.x, rightTop.y)
			var leftBottom = { 'x': topLeft.y, 'y': topLeft.x }
			var rightBottom = { 'x': bottomLeft.y, 'y': bottomLeft.x }
			this.ctx.moveTo(leftBottom.x, leftBottom.y)
			this.ctx.lineTo(rightBottom.x, rightBottom.y)
			
			this.ctx.stroke();
		}
	}

	this.drawSample = function(sample, locationX, locationY) {
		this.ctx.beginPath();
		this.ctx.lineWidth = kUnitAxis/2;
		this.ctx.strokeStyle ='black';
		this.ctx.fillStyle = sample.desire == 1 ? colorCls1 : colorCls2;
		this.ctx.rect(locationX-kUnitAxis/2,locationY-kUnitAxis/2,kUnitAxis,kUnitAxis);	
		this.ctx.stroke();
		this.ctx.fill();
		this.ctx.closePath();
	}

	this.drawSamples = function(samples) {
		samples.forEach(function (sample, index, samples) {
			var viewPoint = this.getViewPoint(sample.data[0], sample.data[1])
			this.drawSample(sample, viewPoint.x, viewPoint.y);
		}, this);
	}

	this.renderOutput = function() {
		for (var i = 0; i < this.kWidth; i+=1) {
			for (var j = 0; j < this.kHeight; j+=1) {
				var axisPoint = this.getAxisPoint(i, j);
				var result = mlp.test({	data: [axisPoint.x, axisPoint.y, 1], desire: 1 });
				if (result == 1) {
					this.ctx.fillStyle = colorCls1;
					this.ctx.fillRect(i,j,1,1);	
				} else {
					this.ctx.fillStyle = colorCls2;
					this.ctx.fillRect(i,j,1,1);
				}
			}
		}
		this.drawSamples(samples);
	}

	this.drawSeparatorLine = function(connections) {
		var fromX = this.maxAxis * -1;
		var toX = this.maxAxis * 1;
	    var fromY = -1 * ((connections[0].weight * fromX) + connections[2].weight) / connections[1].weight;
	    var toY = -1 * ((connections[0].weight * toX) + connections[2].weight) / connections[1].weight;
	    var from = this.getViewPoint(fromX, fromY);
	    var to = this.getViewPoint(toX, toY);

	    this.ctx.beginPath();
	    this.ctx.lineWidth = kUnitAxis/2;
		this.ctx.strokeStyle ='green';
	    this.ctx.moveTo(from.x, from.y);
		this.ctx.lineTo(to.x, to.y)
		this.ctx.stroke();
		this.ctx.closePath();
	}

	this.clear = function() {
		this.ctx.clearRect(0,0,this.kWidth,this.kHeight);
	}

	this.getAxisPoint = function(viewPointX, viewPointY) {
		return {
			x: (viewPointX - this.kOriginX) / kUnitAxis,
			y: (this.kOriginY - viewPointY) / kUnitAxis
		}
	}

	this.getViewPoint = function(axisPointX, axisPointY) {
	    return {
			x: this.kOriginX + (axisPointX * kUnitAxis), 
			y: this.kOriginY - (axisPointY * kUnitAxis)
		}
	}
}
