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
    Module = require('module');

/**
 * Exports
 */

exports.parse = parse;
exports.XjsStream = require('./XjsStream');

/**
 * Allows loading xjs files using require.
 *
 *  var my_template = require('my_template.xjs');
 */

require.extensions['.xjs'] = function(_module, filename) {
  var source = require('fs').readFileSync(filename, 'utf8');
  _module.exports = parse(source, filename);
};

/**
 * Convert xjs source into a renderable object.
 */

function parse(source, options) {
  var object = compile(source, options);
  return object;
};

/**
 * Convert xjs source into javascript.
 */

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
    tab + '({',
    tab + '  render: function(response, local) {',
    tab + '    var end = false;',
    tab + '    if (Object.getPrototypeOf(response) !== module.xjs.XjsStream.prototype) {',
    tab + '      response = new module.xjs.XjsStream(response);',
    tab + '      end = true;',
    tab + '    }',
    tab + '    if (local && typeof local.length === "number" && typeof local !== "string") {',
    tab + '      var callee = arguments.callee;',
    tab + '      for (var i in local) {',
    tab + '        callee.call(this, response, local[i]);',
    tab + '      }',
    tab + '      return;',
    tab + '    }',
    tab + '    local = local || {};',
    tab + '    with(local) {'
  );
  interpretChildren(js, tree, tab + '      ');
  js.push(
    tab + '    }',
    tab + '    if (end) {',
    tab + '      response.end();',
    tab + '    }',
    tab + '  }',
    tab + '})'
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
    tab + 'response.write(' + node.script + ');'
  );
}

function interpretScript(js, node, tab) {
  if (typeof node.script === 'string') {
    js.push(node.script);
  } else {
    node.script.forEach(function(script) {
      if (typeof script === 'string') {
        js.push(script);
      } else {
        interpretTree(js, [script], tab);
      }
    });
  }
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
    tab + 'response.writeTag('
        + 'null, '
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

function compile(source, options) {
  var options = options || {},
      filename = options.filename || 'undefined';
  
  var js = interpret(source);
  
  function require(path) {
    return Module._load(path);
  }
  
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
