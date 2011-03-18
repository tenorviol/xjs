// eval expression
var twelve = eval('5 + 7');
console.log(twelve);

// eval variable expression
var six = eval('twelve / 2');
console.log(six);

// eval function
var eighteen = eval('(function() { return twelve + six; })');
console.log(eighteen);
console.log(eighteen());

var that = { six: 9 };
console.log(eighteen.call(that));
