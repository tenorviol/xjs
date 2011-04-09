var parser = require('../lib/parser'),
    tests = require('./sourceTests');

tests.forEach(function(test) {

  module.exports['parse '+test.source] = function(assert) {
    var result = parser.parse(test.source);
    assert.deepEqual(test.parse, result);
    assert.done();
  };

});
