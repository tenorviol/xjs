xjs
===

XML Javascript templates for node.js

Status (Pre-alpha)
------------------

Still having fun getting all the core features going. Ver 0.2 will be the first alpha release.

Some goals
----------

1. No new languages. Templates are expressed as xml and javascript.
2. Enforce balanced xml markup.
3. Good error reporting, including invalid html/xml.
4. Inline javascript blocks, which can themselves contain inline xjs.
5. Custom tags, with optional asynchronous rendering.
6. Template scope variables.

Usage
-----

Create an xjs template, `helloworld.xjs`:

```html
    {{
      var greeting = 'Hello world!';
    }}
    <html>
    <head>
      <title>My xjs template</title>
    </head>
    <body>
      <div id="greeting">{{= greeting }}</div>
    </body>
    </html>
```

Require the xjs module compiler, and respond to an HTTP request using xjs

```javascript
    require('xjs');
    var http = require('http');
    http.createServer(function (req, res) {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      require('./helloworld.xjs').render(function(result) {
        res.end(result);
      });
    }).listen(8124, "127.0.0.1");
    console.log('Server running at http://127.0.0.1:8124/');
```

Examples
--------

### Echo (html escaped)

```
    {{= 'Hello world! < J.R.R. Tolkein' }}
    
    // Output: Hello world! &lt; J.R.R. Tolkein
```

### Tags

```html
    <div id={foo} class="foo">{{= bar('Fubar!') }}</div>
    
    // Output: <div id="value of foo" class="foo">return value of bar</div>
```

### Inline xj

```html
    <div id="page">
    {{
      var template;
      if (foo) {
        template = <div>{{foo}}</div>
      } else {
        template = <div>bar</div>
      }
      template.render(response);
    }}
    </div>
    
    // Output 1: <div id="page"><div>value of foo</div></div>
    // Output 2: <div id="page"><div>bar</div></div>
```

### Template scope

```html
    {{
      var QS = require('querystring')
      var q = { foo:'bar' };
    }}
    <a href={ '/link?' + QS.stringify(q) }>click me</a>
    
    // Output: <a href="/link?foo=bar">click me</a>
```

### Script modification and output

```html
    <script>
    // <![CDATA[
      console.log({{= JSON.stringify(foo) }});
    // ]]>
    </script>
    
    /* Output:
      <script>
      // <![CDATA[
        console.log("value of foo");
      // ]]>
      </script>
    */
```

License
-------

Copyright (C) 2011 by Christopher Johnson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
