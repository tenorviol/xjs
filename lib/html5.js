var xj = require('./xj');

var Tag = exports.Tag = function(name, attributes, children) {
	this.name = name;
	this.attributes = attributes;
	this.children = children;
};

Tag.prototype = {
	render: function(callback) {
		var result = '<' + this.name;
		if (this.attributes) {
			result += renderAttributes(this.attributes);
		}
		result += '>';
		result += '</' + this.name + '>';
		callback(result);
	}
};

var PCDATA = exports.PCDATA = function(cdata) {
	this.pcdata = xj.escapeHtml(cdata);
};

PCDATA.prototype = {
	render: function(callback) {
		callback(this.pcdata);
	}
};

var CDATA = exports.CDATA = function(cdata) {
	this.pcdata = '<![CDATA['+cdata+']]>';
};

CDATA.prototype = {
	render: function(callback) {
		callback(this.pcdata);
	}
};

function renderAttributes(attributes) {
	var render = '';
	for (var name in attributes) {
		render += ' ' + name + '="' + xj.escapeHtml(attributes[name]) + '"';
	}
	return render;
};
