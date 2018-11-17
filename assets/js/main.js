var getData = function(part, callback) {
	var request = new XMLHttpRequest();
	request.open('GET', 'https://tacos-ocecwkpxeq.now.sh/' + part, true);
	request.onload = function () {
		var data = JSON.parse(this.response);
		if (request.status >= 200 && request.status < 400) {
			var select = document.getElementById(part);
			for (var item of data) {
				var option = document.createElement('option');
				option.value = item.name;
				option.text = item.name;
				select.add(option);
			}
			callback();
		} else {
			alert('Could Not Read Data')
		}
	}

	request.send();
}

var getSelected = function(select) {
	var options = select.options;
	var selected = [];
	for (var option of options) {
		if (option.selected) {
			selected.push(option.value);
		}
	}
	return selected;
}

var getAllData = function() {
	getData('shells', getBaseLayers);
}

var getBaseLayers = function() {
	getData('baseLayers', getMixins);
}

var getMixins = function() {
	getData('mixins', getCondiments);
}

var getCondiments = function() {
	getData('condiments', getSeasonings);
}

var getSeasonings = function() {
	getData('seasonings', doStuff);
}

var doStuff = function() {
	console.log('yay');
}

getAllData();


