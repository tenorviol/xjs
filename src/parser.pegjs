xjs
  = code:(code / tag)*
  {
    return code.join('')
      + 'response.end();\n';
  }


// xml

tag
  = open:openTag children:xjs close:closeTag
  {
    if (open.name != close.name) {
      throw 'tag mismatch';
    }
    return 'xjs.tag(response,'
      + JSON.stringify(open.name) + ','
      + JSON.stringify(open.attributes) + ','
      + 'function(response){\n'
      + children
      + '})\n';
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

genericId
  = first:idStart rest:(nameChar)*
  {
    return first + rest.join("");
  }

idStart = [_:a-zA-Z]

nameChar = [-_.:a-zA-Z0-9]

whitespace = [ \t\r\n\u000C]


// javascript

code
  = '{{' write:'='? js:javascript '}}'
  {
    if (write) {
      return 'response.write(xjs.escapeHtml('+js+'));\n';
    } else {
      return js+'\n';
    }
  }

// TODO: better source parsing
javascript
  = js:[^{}]*
  {
    return js.join('');
  }
