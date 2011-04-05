var parser = require('./parser'),
	vm = require('vm'),
	AsyncStream = require('./AsyncStream');

exports.parse = parse;
exports.escapeHtml = escapeHtml;
exports.writeTag = writeTag;

function parse(source) {
	return new Xjs(source);
};

function Xjs(xjs) {
	var js = parser.parse(xjs);
	var script = vm.createScript(js, 'xjs');
	this.module = script.runInNewContext({
		require:require,
		module:{},
		xjs:module.exports
	});
};

Xjs.prototype.render = render;

function render(response, context) {
	var async_stream = new AsyncStream();
	async_stream.pipe(response);
	this.module(async_stream, context);
};

function escapeHtml(text){
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
};

function writeTag(response, name, attributes, children) {
	response.write('<' + name);
	for (var i in attributes) {
		response.write(' ' + i + '="' + escapeHtml(attributes[i]) + '"');
	}
	response.write('>');
	children(response);
	response.write('</' + name + '>');
};
