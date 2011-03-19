xj = ( tag / emptyTag / PCDATA )*

tag
	= tag:openTag children:xj closeName:closeTag
	{
		if (tag.name != closeName) {
			throw 'tag mismatch';
		}
		return {
			tag: tag.name,
			attributes: tag.attributes,
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

closeTag = '</' name:genericId '>' { return name; }

emptyTag
	= '<' name:genericId attributes:attributes '/>'
	{
		return {
			tag:name,
			attributes:attributes
		};
	}

attributes
	= all:(whitespace+ name:genericId '=' value:attrValue)*
	{
		var attributes = {};
		all.forEach(function(a) {
			var key = a[1];
			var value = a[3];
			attributes[key] = value;
		});
		return attributes;
	}

attrValue
	= '"' value:[^"]* '"'  { return value.join(''); }
	/ '\'' value:[^'] '\'' { return value.join(''); }

PCDATA
	= pcdata:[^<]+
	{ return pcdata.join(''); }

genericId
	= first:idStart rest:(nameChar)*
	{ return first + rest.join(""); }

idStart = letter / [_:]
nameChar = letter / digit / [-_.:]

whitespace = [ \t\r\n\u000C]
letter = [a-zA-Z]
digit = [0-9]
