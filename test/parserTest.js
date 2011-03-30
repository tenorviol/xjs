var parser = require('../lib/parser.js'),
	xj = require('../lib/xj.js');


var tests = [
	{
		input: '<t>Starting text inside t<t1>Text inside t1</t1></t>',
		expected: [{
			type:'tag',
			name:'t',
			attributes:{},
			children:[
				{ type:'pcdata', pcdata:'Starting text inside t' },
				{
					type:'tag',
					name:'t1',
					attributes:{},
					children:[
						{ type:'pcdata', pcdata:'Text inside t1' }
					]
				}
			]
		}]
	},
	{
		input: '<div id="foo" class="bar">Fubar!</div>',
		expected: [{
			type:'tag',
			name:'div',
			attributes:{
				id:'foo',
				'class':'bar'
			},
			children:[
				{ type:'pcdata', pcdata:'Fubar!' }
			]
		}]
	},
	{
		input: '<div id={foo}>bar</div>',
		expected: [{
			type:'tag',
			name:'div',
			attributes:{
				id:{
					type:'script',
					text:'{foo}'
				}
			},
			children:[
				{ type:'pcdata', pcdata:'bar' }
			]
		}]
	}
];


tests.forEach(function(test) {
	exports['test parse '+test.input] = function(assert) {
		var result = parser.parse(test.input);
		assert.deepEqual(test.expected, result);
		assert.done();
	};
});

exports.testMismatchedTagThrows = function(test) {
	test['throws'](function() {
		var input = '<h1>Great Title</h2>';
		parser.parse(input);
	});
	test.done();
};
