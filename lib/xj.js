var parser = require('./parser'),
	vm = require('vm');

exports.parse = function(xj) {
	var tree = parser.parse(xj);
	var children = parseToRenderable(tree);
	var root = new Root(children);
	return root;
};

function parseToRenderable(parse) {
	var renderable = [];
	parse.forEach(function(node) {
		var children;
		if (node.children && node.children.length) {
			children = parseToRenderable(node.children);
		}
		if (node.type == 'tag') {
			var tag = new Tag(node.name, node.attributes, children);
			renderable.push(tag);
		} else if (node.type == 'pcdata') {
			if (node.pcdata.search(/[^ \t\r\n\u000C]/) == -1) {
				return;
			}
			var pcdata = new PCDATA(node.pcdata);
			renderable.push(pcdata);
		} else {
			throw 'unknown node '+JSON.stringify(node);
		}
	});
	return renderable;
}

var Root = function(children) {
	this.children = children;
};

Root.prototype = {
	render: renderChildren
};

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
		
		renderChildren.call(this, function(children_result) {
			result += children_result;
		});
		
		result += '</' + this.name + '>';
		callback(result);
	}
};

var PCDATA = exports.PCDATA = function(text) {
	this.text = escapeHtml(text);
};

PCDATA.prototype = {
	render: function(callback) {
		callback(this.text);
	}
};

var Script = exports.Script = function(text) {
	this.script = vm.createScript(text);
};

Script.prototype = {
	render: function(context) {
		return this.script.runInNewContext(context);
	}
};

var escapeHtml = exports.escapeHtml = function(text){
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
};

function renderAttributes(attributes) {
	var render = '';
	for (var name in attributes) {
		render += ' ' + name + '="' + escapeHtml(attributes[name]) + '"';
	}
	return render;
};

function renderChildren(callback) {
	var result = '';
	this.children.forEach(function(child) {
		child.render(function(child_result) {
			result += child_result;
		});
	});
	callback(result);
}
