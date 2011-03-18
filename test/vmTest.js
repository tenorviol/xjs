var vm = require('vm');

var context = {};

var twelveScript = vm.createScript('5 + 7');
context.twelve = twelveScript.runInThisContext();
console.log(context);

// eval variable expression
var sixScript = vm.createScript('twelve / 2');
context.six = sixScript.runInNewContext(context);
console.log(context);

// eval function
var eighteenScript = vm.createScript('(function() { return twelve + six; })');
var eighteen = eighteenScript.runInNewContext(context);
console.log(eighteen);
console.log(eighteen());

context.six = 9;
console.log(eighteen());
