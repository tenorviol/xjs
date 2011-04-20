/**
 * Copyright (C) 2011 by Christopher Johnson
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var XjsStream = require('../lib/XjsStream'),
    StringStream = require('../lib/StringStream');

exports['test typical stream function'] = function(assert) {
  var stream = new XjsStream();
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
  var stream = new XjsStream();
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
  var stream = new XjsStream();
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
  var stream = new XjsStream();
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

exports['write renderable objects'] = function(assert) {
  var stream = new XjsStream();
  var result = new StringStream();
  stream.pipe(result);
  
  stream.write({
    render: function(stream, local) {
      stream.write(JSON.stringify(local));
    }
  }, { foo : 'bar' });
  
  assert.equal('{"foo":"bar"}', result.toString());
  assert.done();
};
