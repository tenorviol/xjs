lib/xj.js : src/xj.pegjs
	pegjs src/xj.pegjs lib/xj.js

test: testNodeunit

testNodeunit:
	nodeunit test/orderizeTest.js
	nodeunit test/xjTest.js
