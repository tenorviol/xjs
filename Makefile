lib/parser.js : src/parser.pegjs
	pegjs src/parser.pegjs lib/parser.js

test: testNodeunit

testNodeunit:
	nodeunit test/orderizeTest.js
	nodeunit test/parserTest.js
