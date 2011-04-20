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

var stream = require('stream');
var util = require('util');
var StringStream = require('./StringStream');

function XjsStream() {
  this.pending = null;
  this.writable = true;
};
util.inherits(XjsStream, stream.Stream);
module.exports = XjsStream;

XjsStream.prototype.write = write;
XjsStream.prototype.end = end;
XjsStream.prototype.async = async;
XjsStream.prototype.asyncStream = asyncStream;
XjsStream.prototype.kill = kill;

function write(string, data) {
  if (typeof string === 'object' && typeof string.render === 'function') {
    string.render(this, data);
  } else if (this.pending) {
    this.pending[this.count] = string;
    this.count++;
  } else {
    this.emit('data', string);
  }
}

function end(string) {
  if (string) {
    this.write(string);
  }
  if (!this.pending) {
    this.emit('end');
  }
  this.writable = false;
}

function async(func) {
  if (!this.pending) {
    this.pending = [];
    this.count = this.marker = 0;
  }
  
  var that = this;
  var offset = this.count;
  this.count++;
  
  func(function(result) {
    process.call(that, result, offset);
  });
}

function process(result, offset) {
  if (result === undefined) {
    result = null;
  }
  this.pending[offset] = result;
  if (offset > this.marker) {
    return;
  }
  while (this.pending[this.marker] !== undefined) {
    this.emit('data', this.pending[this.marker]);
    this.marker++;
  }
  if (this.marker == this.count) {
    this.pending = null;
    if (!this.writable) {
      this.emit('end');
    }
  }
}

function asyncStream() {
  var asyncStream = new XjsStream();
  var result = new StringStream();
  asyncStream.pipe(result);
  this.async(function(callback) {
    result.on('end', function() {
      callback(result.toString());
    });
  });
  return asyncStream;
}

function kill() {
  while (this.marker < this.count) {
    if (this.pending[this.marker]) {
      this.emit('data', this.pending[this.marker]);
    }
    this.marker++;
  }
  this.writable = false;
  this.emit('end');
}
