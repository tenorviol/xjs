var compile = require('../lib/compile.js'),
	xj = require('../lib/xj.js');

exports.testParse = function(test) {
	var input = '<t>Starting text inside t<t1>Text inside t1</t1></t>';
	var result = compile.parse(input);
	test.deepEqual(result,
		[
			{
				tag:'t',
				attributes:{},
				children:[
					'Starting text inside t',
					{
						tag:'t1',
						attributes:{},
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

exports.testParseAttributes = function(test) {
	var input = '<div id="foo" class="bar">Fubar!</div>';
	var result = compile.parse(input);
	test.deepEqual(result,
		[
			{
				tag:'div',
				attributes:{
					id:'foo',
					'class':'bar'
				},
				children:[
					'Fubar!'
				]
			}
		]
	);
	test.done();
};

exports.testMismatchedTagThrows = function(test) {
	test['throws'](function() {
		var input = '<h1>Great Title</h2>';
		compile.parse(input);
	});
	test.done();
};

exports.testRender = function(test) {
	var template = '\
		<html>\
		<head>\
			<title>Random Title</title>\
		</head>\
		<body>\
			<div id="page">\
				<h1>Random Title</h1>\
			</div>\
		</body>\
		</html>\
	';
	
	var result = xj.render(template);
	test.equal(result, '<html><head><title>Random Title</title></head><body><div id="page"><h1>Random Title</h1></div></body></html>');
	test.done();
};
