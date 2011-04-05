var parser = require('./parser'),
	vm = require('vm'),
	AsyncStream = require('./AsyncStream');

exports.parse = parse;
exports.escapeHtml = escapeHtml;
exports.writeTag = writeTag;

function parse(source) {
	return new Xjs(source);
};

function Xjs(source) {
	this.module = compile(source);
};

Xjs.prototype.render = render;

function compile(source, filename) {
	filename = filename || 'xjs';
	var javascript = parser.parse(source);
	var script = vm.createScript(javascript, filename);
	// TODO: __filename, __dirname
	var context_module = {
		exports:{}
	};
	var context = {
		process:process,
		require:require,
		module:context_module,
		exports:context_module.exports,
		console:console,
		__xjs:module.exports
	};
	script.runInNewContext(context);
	return context.module.exports;
}

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
