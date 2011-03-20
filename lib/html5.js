
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

function renderAttributes(attributes) {
	var render = '';
	for (var name in attributes) {
		render += ' ' + name + '="' + escape(attributes[name]) + '"';
	}
	return render;
}

function escape(cdata){
	return cdata
		.replace(/&(?!\w+;)/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}
