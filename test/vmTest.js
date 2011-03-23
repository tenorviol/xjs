var vm = require('vm'),
	assert = require('assert');

context = {};

var twelveScript = vm.createScript('context.twelve = 5 + 7');
twelveScript.runInThisContext();
assert.equal(12, context.twelve);

// eval variable expression
var sixScript = vm.createScript('this.six = twelve / 2');
sixScript.runInNewContext(context);
assert.equal(6, context.six);

// eval function
var eighteenScript = vm.createScript('(function() { return twelve + six; })');
var eighteen = eighteenScript.runInNewContext(context);
assert.equal('function', typeof eighteen);
assert.equal(18, eighteen());

// but changing the values in the scope has no effect?
context.six = 9;
assert.notEqual(21, eighteen());
