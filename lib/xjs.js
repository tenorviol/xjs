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

var parser = require('./parser'),
    vm = require('vm'),
    AsyncStream = require('./AsyncStream'),
    StringStream = require('./StringStream'),
    Module = require('module');

require.extensions['.xjs'] = function(_module, filename) {
  var source = require('fs').readFileSync(filename, 'utf8');
  var js = interpret(source);
  // TODO: this method may not work out
  // 1. the sync file read may be a performance problem (test?)
  // 2. if the file is changed, we should re-compile
  _module.xjs = module.exports;
  _module._compile(js, filename);
};

exports.parse = parse;
exports.createResponse = createResponse;
exports.escapeHtml = escapeHtml;
exports.writeTag = writeTag;

function parse(source) {
  var js = interpret(source);
  var object = compile(js);
  return object;
};

function interpret(source) {
  var tree = parser.parse(source);
  var js = [
    'module.exports = '
  ];
  interpretTree(js, tree, '');
  js = js.join('\n');
  return js;
}

function interpretTree(js, tree, tab) {
  js.push(
    tab + '{',
    tab + '  render: function(locals, callback, response) {',
    tab + '    var end = false;',
    tab + '    if (!response) {',
    tab + '      response = module.xjs.createResponse(callback);',
    tab + '      end = true;',
    tab + '    }',
    tab + '    with(locals || {}) {'
  );
  interpretChildren(js, tree, '      ');
  js.push(
    tab + '    }',
    tab + '    if (end) {',
    tab + '      response.end();',
    tab + '    }',
    tab + '  }',
    tab + '};'
  );
  return js.join('\n');
}

function interpretChildren(js, children, tab) {
  children.forEach(function(node) {
    interpretNode(js, node, tab);
  });
}

function interpretNode(js, node, tab) {
  switch (node.type) {
    case 'write':
      interpretWrite(js, node, tab);
      break;
      
    case 'script':
      interpretScript(js, node, tab);
      break;
      
    case 'tag':
      interpretTag(js, node, tab);
      break;
      
    case 'pcdata':
      interpretPCDATA(js, node, tab);
      break;
      
    default:
      console.log(node);
      throw new Error('Unknown node type, "' + node.type + '"');
  }
}

function interpretWrite(js, node, tab) {
  js.push(
    tab + '__value = ',
    node.script,
    tab + 'if (__value === undefined || __value === null) {',
    tab + '} else if (__value.render && typeof __value.render === "function") {',
    // TODO: call the render function
    tab + '} else if (typeof __value === "function") {',
    tab + '  response.write("[Function]");',
    tab + '} else {',
    tab + '  response.write(module.xjs.escapeHtml(__value.toString()));',
    tab + '}'
  );
}

function interpretScript(js, node, tab) {
  js.push(
    node.script
  );
}

function interpretTag(js, node, tab) {
  js.push(
    tab + 'var __attributes = {};'
  );
  node.open.attributes.forEach(function(attribute) {
    if (attribute.value.type === 'expression') {
      js.push(
        tab + '__attributes[' + JSON.stringify(attribute.name) + '] =',
        attribute.value.script
      );
    } else {
      js.push(
        tab + '__attributes[' + JSON.stringify(attribute.name) + '] = ' + JSON.stringify(attribute.value)
      );
    }
  });
  js.push(
    tab + 'module.xjs.writeTag(response, '
        + '"' + node.open.name + '", '
        + '__attributes, '
        + 'function(response) {'
  );
  interpretChildren(js, node.children, tab + '  ');
  js.push(
    tab + '});'
  );
}

function interpretPCDATA(js, node, tab) {
  // discard entirely empty PCDATA blocks
  // TODO: override this rule when the PCDATA is adjacent a code block
  if (node.source.search(/[^ \t\r\n\u000C]/) == -1) {
    return;
  }
  js.push(
    tab + 'response.write(' + JSON.stringify(node.source) + ')'
  );
}

function compile(js, filename) {
  
  function require(path) {
    return Module._load(path);
  }
  
  filename = filename || 'xjs';
  var script = vm.createScript(js, filename);
  
  // sneaking xjs in through the module object
  var new_module = {
    xjs:module.exports,
    exports:{}
  };
  
  // TODO: __filename, __dirname ???
  var context = {
    process:process,
    require:require,
    module:new_module,
    exports:new_module.exports,
    console:console
  };
  script.runInNewContext(context);
  
  return context.module.exports;
}

function createResponse(callback) {
  var response = new AsyncStream();
  var result = new StringStream();
  response.pipe(result);
  result.on('end', function() {
    callback(result.toString());
  });
  return response;
}

function escapeHtml(text){
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

function writeTag(response, name, attributes, children) {
  response.write('<' + name);
  for (var i in attributes) {
    response.write(' ' + i + '="' + escapeHtml(attributes[i]) + '"');
  }
  response.write('>');
  children(response);
  response.write('</' + name + '>');
};
