var xj = require('../lib/xj');

//exports.testRender = function(test) {
//	var template = '\
//		<html>\
//		<head>\
//			<title>Random Title</title>\
//		</head>\
//		<body>\
//			<div id="page">\
//				<h1>Random Title</h1>\
//			</div>\
//		</body>\
//		</html>\
//	';
//	
//	var result = xj.render(template);
//	test.equal(result, '<html><head><title>Random Title</title></head><body><div id="page"><h1>Random Title</h1></div></body></html>');
//	test.done();
//};

exports.testFunctions = function(assert) {
	var context = {
		total: 27.2
	};
	// total = 27.2
	var esses = [
		new xj.PCDATA('total = '),
		new xj.Script('total'),
		new xj.PCDATA('<&">')
	];
	
	var result = '';
	esses.forEach(function(s) {
		result += s.render(context);
	});
	assert.equal(result, 'total = 27.2&lt;&amp;&quot;&gt;');
	assert.done();
};
