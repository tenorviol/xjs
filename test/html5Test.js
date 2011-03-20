var Tag = require('../lib/html5.js').Tag;

var tagTests = [
	[
		'<div></div>',
		new Tag('div')
	],
	[
		'<div id="foo"></div>',
		new Tag('div', { id:'foo' })
	],
	[
		'<div id="foo &amp; &quot;bar&quot;" class="&lt;fubar!&gt;"></div>',
		new Tag('div', { id:'foo & "bar"', 'class':'<fubar!>' })
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

