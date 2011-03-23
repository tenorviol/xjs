var html = require('../lib/html5.js'),
	vm = require('vm');

var tagTests = [
	[
		'<div></div>',
		new html.Tag('div')
	],
	[
		'<div id="foo"></div>',
		new html.Tag('div', { id:'foo' })
	],
	[
		'<div id="foo &amp; &quot;bar&quot;" class="&lt;fubar!&gt;"></div>',
		new html.Tag('div', { id:'foo & "bar"', 'class':'<fubar!>' })
	],
	[
		'm = n &lt; o &amp; p',
		new html.PCDATA('m = n < o & p')
	],
	[
		'<![CDATA[<sender>John Smith</sender>]]>',
		new html.CDATA('<sender>John Smith</sender>')
	]
];

tagTests.forEach(function(test) {
	var expected = test[0];
	var tag = test[1];
	exports['testRender '+expected] = function(assert) {
		tag.render(function(result) {
			assert.equal(expected, result);
			assert.done();
		});
	};
});
