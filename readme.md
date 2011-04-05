xjs
===

xml javascript templates for node.js

Some goals
----------

1. No new languages. Templates are expressed as xml and javascript.
2. Enforce balanced xml markup.
3. Good error reporting, including invalid html/xml.
4. Inline javascript blocks, which can themselves contain inline xjs.
5. Custom tags, with optional asynchronous rendering.
6. Template scope variables.

Examples
--------

### Echo (html escaped)

	{{= 'Hello world! < J.R.R. Tolkein' }}
	
	// Output: Hello world! &lt; J.R.R. Tolkein

### Tags

	<div id={foo} class="foo">{{= bar('Fubar!') }}</div>
	
	// Output: <div id="value of foo" class="foo">return value of bar</div>

### Inline xj

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

### Template scope

	{{
		var QS = require('querystring')
		var q = { foo:'bar' };
	}}
	<a href={ '/link?' + QS.stringify(q) }>click me</a>
	
	// Output: <a href="/link?foo=bar">click me</a>

### Script modification and output

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
