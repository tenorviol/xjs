var xj = require('../lib/xj');

var tests = [
	{
		template: '<div id="foo">bar</div>',
		expected: '<div id="foo">bar</div>'
	},
	{ // empty space between tags will be removed
		template: '<ul> <li>foo</li> <li>bar</li> </ul>',
		expected: '<ul><li>foo</li><li>bar</li></ul>'
	},
	{
		template: '<div id={foo}>bar</div>',
		context: { foo:'Fubar!' },
		expected: '<div id="Fubar!">bar</div>'
	}
];

tests.forEach(function(test) {
	
	exports['render '+test.template] = function(assert) {
		var parse = xj.parse(test.template);
		parse.render(function(result) {
			assert.equal(test.expected, result);
			assert.done();
		}, test.context);
	};
	
});
