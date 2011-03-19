lib/compile.js : src/compile.pegjs
	pegjs src/compile.pegjs lib/compile.js

test: testNodeunit

testNodeunit:
	nodeunit test/orderizeTest.js
	nodeunit test/compileTest.js
