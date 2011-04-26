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

var util = require('util'),
    Stream = require('stream').Stream;

module.exports = XjsStream;

function XjsStream() {
  this.writable = true;
  this._buffer = null;
}

util.inherits(XjsStream, Stream);

/**
 * Write data to the stream.
 * All strings are treated as utf8.
 * Functions will render as '[Function]' to
 * avoid accidentally dumping code to the world.
 * Other objects will be rendered using their
 * `render` or `toString` method.
 */

XjsStream.prototype.write = function(data) {
  if (!this.writable) {
    throw new Error('Stream has been closed');
  }
  if (data === undefined || data === null) {
    return;
  }
  switch (typeof data) {
  case 'string':
    this.writeRaw(
      data
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
    );
    break;
  case 'function':
    this.writeRaw('[Function]');
    break;
  default:
    if (data.render && typeof data.render === 'function') {
      var args = Array.prototype.slice.call(arguments);
      args[0] = this;  // data.render(stream [, ...] )
      data.render.apply(data, args);
    } else {
      this.write(data.toString());
    }
  }
};

XjsStream.prototype.writeRaw = function(string) {
  if (this._buffer) {
    this._buffer.push(string);
  } else {
    this.emit('data', string, 'utf8');
  }
};

XjsStream.prototype.writeTag = function(ns, name, attributes, children) {
  this.writeRaw('<');
  if (ns) {
    this.writeRaw(ns + ':');
  }
  this.write(name);
  for (var a in attributes) {
    this.writeRaw(' ' + a + '="');
    this.write(attributes[a].toString());
    this.writeRaw('"');
  }
  if (children) {
    this.writeRaw('>');
    children(this);
    this.writeRaw('</');
    if (ns) {
      this.writeRaw(ns + ':');
    }
    this.writeRaw(name + '>');
  } else {
    this.writeRaw('/>');
  }
};

/**
 * Write the ending data and close the stream,
 * sending an 'end' event for the writable
 * stream listeners.
 */

XjsStream.prototype.end = function(data) {
  if (data) {
    this.write.apply(this, arguments);
  }
  this.writable = false;
  if (!this._buffer) {
    this.emit('end');
  }
};

XjsStream.prototype.async = function(callback) {
  var stream = this;
  var async = new XjsStream();
  if (!this._buffer) {
    this._buffer = [];
    this._marker = 0;
  } else {
    async._buffer = [];
    async._marker = 0;
  }
  (function(i) {
    async.on('end', function() {
      if (stream._marker == i) {
        emitBuffer.call(stream);
      }
    });
  })(this._buffer.length);
  async.on('data', function(data) {
    stream.emit('data', data);
  });
  this.on('kill', function() {
    async.kill();
  });
  this._buffer.push(async);
  callback && callback(async);
  return async;
};

XjsStream.prototype.kill = function() {
  this.emit('kill');
  this.end();
};

/**
 * When not waiting on an async substream, emit right away.
 * Otherwise start._buffering.
 */

function emitBuffer() {
  if (!this._buffer) {
    return;
  }
  for (var i = this._marker; i < this._buffer.length; i++) {
    var data = this._buffer[i];
    if (data.writable === true) {
      break;
    } else if (data.writable === false) {
      emitBuffer.call(data);
    } else {
      this.emit('data', data, 'utf8');
    }
  }
  if (i === this._buffer.length) {
    delete this._buffer;
    delete this._marker;
    if (!this.writable) {
      this.emit('end');
    }
  } else {
    this._marker = i;
  }
}
