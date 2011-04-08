var parser = require('../lib/parser'),
    tests = require('./tests');

tests.forEach(function(test) {

  module.exports['parse '+test.source] = function(assert) {
    var result = parser.parse(test.source);
    assert.deepEqual(test.parse, result);
    assert.done();
  };

});
