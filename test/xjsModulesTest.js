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

var xjs = require('../lib/xjs'),
    StringStream = require('../lib/StringStream');

var tests = [

  {
    filename: '../example/helloworld.xjs',
    render: '<html><head><title>Hello world!</title></head><body><h1>Hello world!</h1></body></html>'
  },

  {
    filename: '../example/templatefun.xjs',
    render: '<html><body><h1>bar</h1></body></html>'
  },

  {
    filename: '../example/array.xjs',
    render: '<ul><li>apple</li><li>pear</li><li>banana</li></ul>'
  },

  {
    filename: '../example/index.xjs',
    local: { dir:__dirname },
    // NOTE: new dir files must accompany a change in the render
    render: '<html><body><ul><li>AsyncStreamTest.js</li><li>StringStreamTest.js</li><li>xjsModulesTest.js</li><li>xjsTest.js</li></ul></body></html>'
  }

];

tests.forEach(function(test) {
  
  exports['render ' + test.filename] = function(assert) {
    var result = new StringStream();
    
    result.on('end', function() {
      assert.equal(test.render, result.toString());
      assert.done();
    });
    
    var template = require(test.filename);
    template.render(result, test.local);
  };
  
});
