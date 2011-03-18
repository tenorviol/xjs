/*
var Scanner = require('../lib/Scanner.js');

exports.testOnlyText = function(test) {
	var text = 'foo\n\tfunction bar()';
	var s = new Scanner('foo');
	s.
	console.log(scan);
};

*/

var org = require('../src/antlr3-all');
var xj = require('../src/xjLexer.js');

var input = '<t>Starting text inside t<t1>Text inside t1</t1></t>',
	cstream = new org.antlr.runtime.ANTLRStringStream(input),
	lexer = new xj.xjLexer(cstream),
	tstream = new org.antlr.runtime.CommonTokenStream(lexer);

print(tstream.nextToken());
while (token = tstream.nextToken()) {
	console.log(token);
}
