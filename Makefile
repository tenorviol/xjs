lib/parser.js : src/parser.pegjs
	pegjs src/parser.pegjs lib/parser.js

test: nodeunit

nodeunit:
	nodeunit test/StringStreamTest.js
	nodeunit test/AsyncStreamTest.js
	nodeunit test/xjsTest.js
	nodeunit test/xjsModulesTest.js
