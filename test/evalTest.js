var assert = require('assert');

// eval expression
var twelve = eval('5 + 7');
assert.equal(12, twelve);

// eval variable expression
var six = eval('twelve / 2');
assert.equal(6, six);

// eval function
var eighteen = eval('(function() { return twelve + six; })');
assert.equal('function', typeof eighteen);
assert.equal(18, eighteen());

// what if we change the values in the local scope?
six = 9;
assert.equal(21, eighteen());

// but we are unable to change the scope
var scope = { six:6 };
assert.notEqual(18, eighteen.call(scope));
