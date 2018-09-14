function onClickCanvas(event) {
	console.log(event);
	var inputRadio1 = document.getElementById("Class1");
	var inputRadio2 = document.getElementById("Class2");

	var axisPoint = canvas.getAxisPoint(event.offsetX, event.offsetY);
	var sample = {
		data: [ axisPoint.x, axisPoint.y, 1],
		desire: inputRadio1.checked ? 1 : -1	
	}

	samples.push(sample);
	canvas.drawSample(sample, event.offsetX, event.offsetY);
	toggleClass(inputRadio1, inputRadio2);
}

function toggleClass(inputRadio1, inputRadio2) {
	if (inputRadio1.checked) {
		inputRadio1.checked = false;
		inputRadio2.checked = true;
	} else {
		inputRadio1.checked = true;
		inputRadio2.checked = false;
	}
}

function onClickInit(event) {
	slp.init(samples, 2+1, 1);
	btnInit.disabled = true;
	btnTrain.disabled = false;
	btnClear.disabled = false;
}

function onClickTrain(event) {
	slp.learn();
	canvas.renderOutput();
	canvas.drawSeparatorLine(slp.connections);
}

function onClickClear(event) {
	samples = [];
	slp.reset();
	canvas.clear();
	btnInit.disabled = false;
	btnTrain.disabled = true;
	btnClear.disabled = true;
}

function rateChanged(sliderID, textbox) {
    var x = document.getElementById(textbox);
    var y = document.getElementById(sliderID);
    x.textContent = y.value;
    slp.learningRate = y.value;
}

function epochesChanged(sliderID, textbox) {
    var x = document.getElementById(textbox);
    var y = document.getElementById(sliderID);
    x.textContent = y.value;
    slp.epoches = y.value;
}