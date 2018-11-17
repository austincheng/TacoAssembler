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

var createTaco = function(random = false) {
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
		if (random) {
			item.innerHTML = 'The computer has served you ';
		} else {
			item.innerHTML = 'You created ';
		}
		item.innerHTML += 'a taco made of ' + shell;
		item.innerHTML += ' with ' + baseLayer;
		item.innerHTML += ', mixed in with ' + getFormattedString(mixins);
		item.innerHTML += ', sprinkled with ' + getFormattedString(condiments);
		item.innerHTML += ', covered in ' + seasoning + '!';
		item.onmouseover = strikeText;
		item.onmouseout = restoreText;
		item.onclick = removeText;
		list.appendChild(item);
	}
}

var strikeText = function(evt) {
	var li = evt.target;
	li.style.textDecoration = 'line-through';
	li.style.cursor = 'pointer';
}

var restoreText = function(evt) {
	var li = evt.target;
	li.style.textDecoration = 'none';
	li.style.cursor = 'none';
}

var removeText = function(evt) {
	var li = evt.target;
	li.parentNode.removeChild(li);
}

var randomTaco = function() {
	var shells = document.getElementById('shells').options;
	var baseLayers = document.getElementById('baseLayers').options;
	var mixins = document.getElementById('mixins').options;
	var condiments = document.getElementById('condiments').options;
	var seasonings = document.getElementById('seasonings').options;

	resetSelect();

	var shell = shells[getRandomInt(0, shells.length)];
	var baseLayer = baseLayers[getRandomInt(0, baseLayers.length)];

	var numMixins = getRandomInt(1, 3);
	var mixinValues = [];
	var usedIndices = [];
	for (var i = 0; i < numMixins; i++) {
		var index = getRandomInt(0, mixins.length);
		while (usedIndices.indexOf(index) != -1) {
			index = getRandomInt(0, mixins.length);
		}
		mixinValues.push(mixins[index]);
		usedIndices.push(index);
	}

	var numCondiments = getRandomInt(1, 4);
	var condimentValues = [];
	usedIndices = [];
	for (var i = 0; i < numCondiments; i++) {
		var index = getRandomInt(0, condiments.length);
		while (usedIndices.indexOf(index) != -1) {
			index = getRandomInt(0, condiments.length);
		}
		condimentValues.push(condiments[index]);
		usedIndices.push(index);
	}

	var seasoning = seasonings[getRandomInt(0, seasonings.length)];

	shell.selected = true;
	baseLayer.selected = true;
	for (var mixin of mixinValues) {
		mixin.selected = true;
	}
	for (var condiment of condimentValues) {
		condiment.selected = true;
	}
	seasoning.selected = true;
	createTaco(true);
}

var getRandomInt = function(start, end) {
	return Math.floor((Math.random() * (end - start)) + start);
}

var resetSelect = function() {
	var mixins = document.getElementById('mixins').options;
	var condiments = document.getElementById('condiments').options;
	for (var mixin of mixins) {
		mixin.selected = false;
	}
	for (var condiment of condiments) {
		condiment.selected = false;
	}
}

var removeAllTacos = function() {
	var list = document.getElementById('taco-list');
	list.innerHTML = '';
}