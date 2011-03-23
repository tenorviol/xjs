var vm = require('vm');

exports.render = function(xj) {
	
};

var PCDATA = exports.PCDATA = function(text) {
	this.text = escapeHtml(text);
};

PCDATA.prototype = {
	render: function() {
		return this.text;
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
