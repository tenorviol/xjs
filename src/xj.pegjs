start = ( tag / emptyTag / PCDATA )*

tag =
	tag:openTag children:start closeTag
	{
		// TODO: check the open and close tags match
		return {
			tag: tag.name,
			children: children
		}
	}

openTag =
	'<' name:name '>'
	{
		return {
			name:name
		}
	}

closeTag = '</' name:name '>' { return name }

emptyTag =
	'<' name:name '/>'
	{
		return {
			tag:name
		}
	}

PCDATA = pcdata:[^<]+ { return pcdata.join('') }

name = first:namestart rest:(namechar)* { return first + rest.join("") }

namestart = letter / '_' / ':'
namechar = letter / digit / '.' / '-' / '_' / ':'

whitespace = [ \t\r\n\u000C]
letter = [a-zA-Z]
digit = [0-9]
