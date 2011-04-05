var xjs = require('../lib/xjs'),
	StringStream = require('../lib/StringStream');

var tests = [
	{
		xjs: '{{=foo}}',
		context: { foo:'bar' },
		expect: 'bar'
	},
	{
		xjs: '{{=foo}}{{=bar()}}',
		context: { foo:'Hello ', bar:world },
		expect: 'Hello world!'
	},
	{
		xjs: '{{=bar}}',
		context: { bar:'<>"&' },
		expect: '&lt;&gt;&quot;&amp;'
	},
	{
		xjs: '{{foo="bar"}}<div>{{=foo}}</div>',
		expect: '<div>bar</div>'
	},
	{
		xjs: '{{= require("querystring").stringify({ foo:"bar"} ) }}',
		expect: 'foo=bar'
	}
];

function world() {
	return 'world!';
}

tests.forEach(function(test) {
	exports['script ' + test.xjs] = function(assert) {
		test.context = test.context || {};
		var response = new StringStream();
		
		response.on('end', function() {
			assert.equal(test.expect, response.toString());
			assert.done();
		});
		
		var script = xjs.parse(test.xjs);
		script.render( response, test.context );
	};
});
