var xjs = require('../lib/xjs');

var tests = [

  {
    filename: './templates/test1.xjs',
    locals: {foo:'bar'},
    render: 'bar'
  }

];

tests.forEach(function(test) {
  
  exports['render ' + test.filename] = function(assert) {
    var template = require(test.filename);
    template.render(test.locals, function(result) {
      assert.equal(test.render, result);
      assert.done();
    });
  };
  
});
