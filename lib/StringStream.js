var stream = require('stream');
var util = require('util');

function StringStream() {
	this.string = '';
	this.writable = true;
};
util.inherits(StringStream, stream.Stream);
module.exports = StringStream;

// NOTE: utf8 encoding assumed
StringStream.prototype.write = function(string) {
	this.string += string;
	return true;
};

StringStream.prototype.end = function(string) {
	if (string) {
		this.string += string;
	}
	this.emit('end');
};

StringStream.prototype.toString = function() {
	return this.string;
};
