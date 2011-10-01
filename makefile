lib/parser.js : src/parser.pegjs
	pegjs src/parser.pegjs lib/parser.js

test: nodeunit

nodeunit:
	nodeunit test
