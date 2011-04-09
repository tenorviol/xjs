var xjs = require('../lib/xjs'),
    tests = require('./fileTests');

tests.forEach(function(test) {
  
  exports['render ' + test.filename] = function(assert) {
    console.log(test.filename);
    var template = require(test.filename);
    template.render(test.locals, function(result) {
      assert.equal(test.render, result);
      assert.done();
    });
  };
  
});
