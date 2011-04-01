xj
==

Something wonderful

Some goals
----------

1. No new languages. Templates expressed as xml/Javascript
2. Enforce good balanced markup
3. Informed html output
4. Inline code blocks, which can contain inline xj
5. Custom tag creation, with asynchronous tag behavior

Examples
--------

Echo (html escaped)

	{{'Hello world! < J.R.R. Tolkein'}}
	
	// Output: Hello world! &lt; J.R.R. Tolkein

Tags

	<div id={{foo}} class="foo">{{bar('Fubar!')}}</div>
	
	// Output: <div id="value of foo" class="foo">return value of bar</div>

Inline xj

	<div id="page">
	{{
		if (foo) {
			<div>{{foo}}</div>
		} else {
			<div>bar</div>
		}
	}}
	</div>
	
	// Output 1: <div id="page"><div>value of foo</div></div>
	// Output 2: <div id="page"><div>bar</div></div>
