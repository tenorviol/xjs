var xj = require('../lib/xj');

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
