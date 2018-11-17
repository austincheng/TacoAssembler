var getData = function(part, callback) {
	var request = new XMLHttpRequest();
	request.open('GET', 'https://tacos-ocecwkpxeq.now.sh/' + part, true);
	request.onload = function () {
		var data = JSON.parse(this.response);
		if (request.status >= 200 && request.status < 400) {
			var select = document.getElementById(part);
			for (var item of data) {
				var option = document.createElement('option');
				option.value = item.slug;
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

var getSelected = function(select) {
	var options = select.options;
	var selected = [];
	for (var option of options) {
		if (option.selected) {
			selected.push(option.text);
		}
	}
	return selected;
}

var getSelectedOptions = function(select) {
	var options = select.options;
	var selected = [];
	for (var option of options) {
		if (option.selected) {
			selected.push(option);
		}
	}
	return selected;
}

var getFormattedString = function(items) {
	if (items.length === 1) {
		return items[0];
	} else if (items.length == 2) {
		return items[0] + ' and ' + items[1];
	} else {
		result = '';
		for (var i in items) {
			var item = items[i]
			if (i == items.length - 1) {
				result += 'and ' + item;
			} else {
				result += item + ', ';
			}
		}
		return result;
	}
}

var createTaco = function() {
	var shell = getSelected(document.getElementById('shells'))[0];
	var baseLayer = getSelected(document.getElementById('baseLayers'))[0];
	var mixins = getSelected(document.getElementById('mixins'));
	var condiments = getSelected(document.getElementById('condiments'));
	var seasoning = getSelected(document.getElementById('seasonings'))[0];
	if (mixins.length === 0) {
		var error = document.getElementById('error-mixins');
		error.innerHTML= 'You must select at least 1 mixin.';
	} 
	if (condiments.length === 0) {
		var error = document.getElementById('error-condiments');
		error.innerHTML= 'You must select at least 1 condiment.';
	}

	if (mixins.length > 0 && condiments.length > 0) {
		var list = document.getElementById('taco-list');
		var item = document.createElement('li');
		item.innerHTML = 'You created a taco made of ' + shell;
		item.innerHTML += ' with ' + baseLayer;
		item.innerHTML += ', mixed in with ' + getFormattedString(mixins);
		item.innerHTML += ', sprinkled with ' + getFormattedString(condiments);
		item.innerHTML += ', covered in ' + seasoning + '!';
		list.appendChild(item);
	}
}

currentStuff = {'mixins': [], 'condiments': []};
var selectChange = function(part) {
	var select = document.getElementById(part);
	var selected = getSelectedOptions(select);
	var error = document.getElementById('error-' + part);
	var threshold;
	if (part === 'mixins') {
		threshold = 2;
	} else if (part === 'condiments') {
		threshold = 3;
	}

	if (selected.length > threshold) {
		for (var option of selected) {
			if (currentStuff[part].indexOf(option) == -1) {
				option.selected = false;
				break;
			}
		}
		error.innerHTML = 'You can only select up to ' + threshold + ' ' + part;
	} else if (selected.length == 1 || selected.length == threshold - 1) {
		error.innerHTML = '';
		currentStuff[part] = selected;
	} else {
		currentStuff[part] = selected;
	}
}