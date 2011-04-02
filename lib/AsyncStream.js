var stream = require('stream');
var util = require('util');

function AsyncStream() {
	this.pending = null;
	this.writable = true;
};
util.inherits(AsyncStream, stream.Stream);
module.exports = AsyncStream;

AsyncStream.prototype.write = write;
AsyncStream.prototype.end = end;
AsyncStream.prototype.async = async;
AsyncStream.prototype.kill = kill;

function write(string) {
	if (this.pending) {
		this.pending[this.count] = string;
		this.count++;
	} else {
		this.emit('data', string);
	}
}

function end(string) {
	if (string) {
		this.write(string);
	}
	if (!this.pending) {
		this.emit('end');
	}
	this.writable = false;
}

function async(func) {
	if (!this.pending) {
		this.pending = [];
		this.count = this.marker = 0;
	}
	
	var that = this;
	var offset = this.count;
	func(function(result) {
		process.call(that, result, offset);
	});
	
	this.count++;
}

function process(result, offset) {
	if (result === undefined) {
		result = null;
	}
	this.pending[offset] = result;
	if (offset > this.marker) {
		return;
	}
	while (this.pending[this.marker] !== undefined) {
		this.emit('data', this.pending[this.marker]);
		this.marker++;
	}
	if (this.marker == this.count) {
		this.pending = null;
		if (!this.writable) {
			this.emit('end');
		}
	}
}

function kill() {
	while (this.marker < this.count) {
		if (this.pending[this.marker]) {
			this.emit('data', this.pending[this.marker]);
		}
		this.marker++;
	}
	this.writable = false;
	this.emit('end');
}
