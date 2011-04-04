var parser = require('./parser'),
	vm = require('vm'),
	AsyncStream = require('./AsyncStream'),
	StringStream = require('./StringStream');

exports.parse = function(source) {
	return new Parse(source);
};

var Parse = function(xjs) {
	var js = parser.parse(xjs);
	this.script = vm.createScript(js);
};

Parse.prototype.run = function(context) {
	var response = new AsyncStream();
	response.pipe(context.response);
	context.response = response;
	context.xjs = module.exports;
	this.script.runInNewContext(context);
};

var escapeHtml = exports.escapeHtml = function(text){
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
};

var tag = exports.tag = function(response, name, attributes, children) {
	response.write('<' + name);
	for (var i in attributes) {
		response.write(' ' + i + '="' + escapeHtml(attributes[i]) + '"');
	}
	response.write('>');
	children(response.asyncStream());
	response.write('</' + name + '>');
};
