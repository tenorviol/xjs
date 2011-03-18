var assert = require('assert'),
	orderize = require('../lib/orderize.js');

exports.testOrderizeCallbacks = function(test) {
	orderize(
		function(result) {
			test.deepEqual(['foo', 'bar', 'fubar'], result);
			test.done();
		},
		function(callback) {
			setTimeout(function() {
				callback('foo');
			}, 20);
		},
		function(callback) {
			setTimeout(function() {
				callback('bar');
			}, 5);
		},
		function(callback) {
			callback('fubar');
		}
	);
};

exports.testOrderizeTimeout = function(test) {
	orderize(
		function(result) {
			// TODO: it may be a bug in nodeunit that doesn't let us deepEqual this?
			test.equal(3, result.length);
			test.equal(undefined, result[0]);
			test.equal('bar', result[1]);
			test.equal('fubar', result[2]);
			test.done();
		},
		10,
		function(callback) {
			setTimeout(function() {
				callback('foo');
			}, 20);
		},
		function(callback) {
			setTimeout(function() {
				callback('bar');
			}, 5);
		},
		function(callback) {
			callback('fubar');
		}
	);
};
