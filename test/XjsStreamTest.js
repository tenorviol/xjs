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

var tests = [

  {
    name: 'test typical stream behavior',
    expect : 'Good morning\ngood afternoon\nand good night!',
    render : function(stream) {
      stream.write('Good morning\n');
      stream.write('good afternoon\n');
      stream.end('and good night!');
    }
  },

  {
    name : 'test writing various objects to the stream',
    expect : '[Function]barfood!fubar',
    render : function(stream) {
      // these should never register on the stream
      stream.write(null);
      stream.write(undefined);

      // functions should always render as '[Function]'
      stream.write(function() {});

      // first try an object's render method
      stream.write({
        render: function(stream, arg1, arg2) {
          stream.write(arg2);
          stream.write(arg1);
        },
        toString: function() {
          return 'nothing to see here';
        }
      }, 'food!', 'bar');

      // objects lacking render use toString()
      stream.write({
        toString: function() { return 'fubar'; }
      });

      stream.end();
    }
  },

  {
    name : 'test escape',
    expect : '&lt;&gt;&amp;&quot; &quot;&amp;&lt;&gt;',
    render : function(stream) {
      stream.escape('<>&" "&<>');
      stream.end();
    }
  },

  {
    name : 'test tag writing',
    expect : '<div id="name" class="user"><fb:name uid="4"/></div>',
    render : function(stream) {
      stream.writeTag(null, 'div', { id : 'name', 'class' : 'user' },
        function(stream) {
          stream.writeTag('fb', 'name', { uid : 4 });
        }
      );
      stream.end();
    }
  },
  
  {
    name : 'test async substream',
    expect : '<div>monkey in the middle</div>',
    render : function(stream) {
      var async;
      
      stream.writeTag(null, 'div', {}, function(stream) {
        // the async substream is bookmarked between the parent tags
        async1 = stream.async();
        async2 = stream.async();
      });
      stream.end();
      
      // ending the async substream can take arbitrarily long
      setTimeout(function() {
        async1.end('monkey');
      }, 10);
      
      async2.write(' in ');
      async2.end('the middle');
    }
  }

];

tests.forEach(function(test) {
  
  exports[test.name] = function(assert) {
    assert.expect(4);
    
    var stream = new XjsStream();
    var result = new StringStream();
    stream.pipe(result);
    
    result.on('end', function() {
      assert.equal(test.expect, result.toString());
      assert.equal(false, stream.writable);
      assert['throws'](function() {
        stream.write('this should throw');
      });
      assert.done();
    });
    
    assert.equal(true, stream.writable);
    test.render(stream);
  };

});

/*
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
*/