{
  var vm = require('vm');
}

xj = ( tag / emptyTag / PCDATA / script )*

tag
	= open:openTag children:xj close:closeTag
	{
		if (open.name != close.name) {
			throw 'tag mismatch';
		}
		return {
			type: 'tag',
			name: open.name,
			attributes: open.attributes,
			children: children
		};
	}

openTag
	= '<' name:genericId attributes:attributes '>'
	{
		return {
			name:name,
			attributes:attributes
		};
	}

closeTag
	= '</' name:genericId '>'
	{
		return { name:name };
	}

emptyTag
	= '<' name:genericId attributes:attributes '/>'
	{
		return {
			type: 'tag',
			name: name,
			attributes: attributes
		};
	}

attributes
	= all:(whitespace+ name:genericId '=' value:attrValue)*
	{
		var attributes = {};
		all.forEach(function(attribute) {
			var key = attribute[1];
			var value = attribute[3];
			attributes[key] = value;
		});
		return attributes;
	}

attrValue
	= '"' value:[^"]* '"'  { return value.join(''); }
	/ '\'' value:[^'] '\'' { return value.join(''); }
	/ script

script
	= source:codeBlock
	{
		var script = vm.createScript(source);
		return (function(script) {
			return function(context) {
				return script.runInNewContext(context);
			};
		})(script);
	}

codeBlock
	= '{' inner:([^{}]+ / codeBlock )* '}'
	{
		return '{' + inner[0].join('') + '}';
	}

PCDATA
	= pcdata:[^<{]+
	{
		return {
			type: 'pcdata',
			pcdata: pcdata.join('')
		};
	}

genericId
	= first:idStart rest:(nameChar)*
	{
		return first + rest.join("");
	}

idStart = letter / [_:]

nameChar = letter / digit / [-_.:]

whitespace = [ \t\r\n\u000C]

letter = [a-zA-Z]

digit = [0-9]
