start = (tag / emptyTag / PCDATA)*

tag = tag:openTag content:start closeTag { return { tag:tag, content:content } }

openTag = '<' name:name '>' { return { tag:name } }
closeTag = '</' name:name '>' { return { close:name } }
emptyTag = '<' name:name '/>' { return { tag:name } }

PCDATA = pcdata:[^<]+ { return pcdata.join('') }

name = first:( letter / '_' / ':') next:(namechar)* { return first + next.join("") }

namechar = letter / digit / '.' / '-' / '_' / ':'
letter = [a-zA-Z]
digit = [0-9]
