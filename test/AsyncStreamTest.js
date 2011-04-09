var AsyncStream = require('../lib/AsyncStream'),
  StringStream = require('../lib/StringStream');

exports['test typical stream function'] = function(assert) {
  var stream = new AsyncStream();
  var result = new StringStream();
  stream.pipe(result);
  
  assert.equal(true, stream.writable);
  
  stream.write('Good morning\n');
  stream.write('good afternoon\n');
  stream.end('and good night!');
  
  assert.equal('Good morning\ngood afternoon\nand good night!', result.toString());
  assert.done();
};


exports['test async callback'] = function(test) {
  var stream = new AsyncStream();
  var result = new StringStream();
  stream.pipe(result);
  
  stream.write(1);
  stream.async(function(callback) {
    setTimeout(function() {
      callback(' foo ');
    }, 20);
  });
  stream.write(2);
  stream.async(function(callback) {
    setTimeout(function() {
      callback(' bar ');
    }, 5);
  });
  stream.write(3);
  stream.async(function(callback) {
    callback(' fubar ');
  });
  stream.end(4);
  
  result.on('end', function() {
    test.equal('1 foo 2 bar 3 fubar 4', result.toString());
    test.done();
  });
};

exports['test kill async'] = function(test) {
  var stream = new AsyncStream();
  var result = new StringStream();
  stream.pipe(result);
  
  stream.async(function(callback) {
    setTimeout(function() {
      callback('foo');
    }, 20);
  });
  stream.async(function(callback) {
    setTimeout(function() {
      callback('bar');
    }, 5);
  });
  stream.async(function(callback) {
    callback('fubar');
  });
  stream.end();
  
  // after 10ms, signal the stream to finish
  setTimeout(function() {
    stream.kill();
  }, 10);
  
  result.on('end', function() {
    test.equal('barfubar', result.toString());
    test.done();
  });
};

exports['test async stream'] = function(assert) {
  var stream = new AsyncStream();
  var result = new StringStream();
  stream.pipe(result);
  
  stream.write(1);
  stream.async(function(callback) {
    setTimeout(function() {
      callback('foo');
    }, 20);
  });
  
  stream.write(2);
  var asyncStream = stream.asyncStream();
  
  stream.write(3);
  stream.async(function(callback) {
    setTimeout(function() {
      callback('bar');
    }, 5);
  });
  
  asyncStream.write('|2.1');
  asyncStream.async(function(callback) {
    callback('fubar');
  });
  asyncStream.end('2.2|');
  
  stream.end(4);
  
  result.on('end', function() {
    assert.equal('1foo2|2.1fubar2.2|3bar4', result.toString());
    assert.done();
  });
};
