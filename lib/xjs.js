var parser = require('./parser'),
    vm = require('vm'),
    AsyncStream = require('./AsyncStream'),
    StringStream = require('./StringStream');

exports.parse = parse;
exports.createResponse = createResponse;
exports.escapeHtml = escapeHtml;
exports.writeTag = writeTag;

function parse(source) {
  var tree = parser.parse(source);
  var js = [ 'module.exports = ' ];
  interpretTree(js, tree, '');
  js = js.join('\n');
  var object = compile(js);
  return object;
};

function interpretTree(js, tree, tab) {
  js.push(
    tab + '{',
    tab + '  render: function(locals, callback, response) {',
    tab + '    var end = false;',
    tab + '    if (!response) {',
    tab + '      response = __xjs.createResponse(callback);',
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
      
    default:
      console.log(node);
      throw new Error('Unknown node type, "' + node.type + '"');
  }
}

function interpretWrite(js, node, tab) {
  js.push(
    tab + '__value = ',
    node.script,
    // TODO: handle objects w/render method
    tab + 'response.write(__xjs.escapeHtml(__value.toString()))'
  );
}

function interpretScript(js, node, tab) {
  js.push(
    node.script
  );
}

function interpretTag(js, node, tab) {
  js.push(
    tab + '__xjs.writeTag(response, '
        + '"' + node.open.name + '", '
        + JSON.stringify(node.open.attributes) + ', '
        + 'function(response) {'
  );
  interpretChildren(js, node.children, tab + '  ');
  js.push(
    tab + '});'
  );
}

function compile(js, filename) {
	filename = filename || 'xjs';
	var script = vm.createScript(js, filename);
	// TODO: __filename, __dirname
	var context_module = {
		exports:{}
	};
	var context = {
		process:process,
		require:require,
		module:context_module,
		exports:context_module.exports,
		console:console,
		__xjs:module.exports
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
