var xjs = require('../lib/xjs'),
    tests = require('./tests');

tests.forEach(function(test) {
  
  exports['render ' + test.source] = function(assert) {
    var template = xjs.parse(test.source);
    template.render(test.locals, function(result) {
      assert.equal(test.render, result);
      assert.done();
    });
  };
  
});
