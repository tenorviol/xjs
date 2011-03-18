/*
var Scanner = require('../lib/Scanner.js');

exports.testOnlyText = function(test) {
	var text = 'foo\n\tfunction bar()';
	var s = new Scanner('foo');
	s.
	console.log(scan);
};

*/

var xj = require('../lib/xj.js');

exports.testParse = function(test) {
	var input = '<t>Starting text inside t<t1>Text inside t1</t1></t>';
	var result = xj.parse(input);
	test.deepEqual(result,
		[
			{
				tag:'t',
				children:[
					'Starting text inside t',
					{
						tag:'t1',
						children:[
							'Text inside t1'
						]
					}
				]
			}
		]
	);
	test.done();
};
