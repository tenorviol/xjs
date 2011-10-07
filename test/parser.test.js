// simple tests to check that the parser can recognize javascript

var util = require('util');
var parser = require('../lib/parser');

[
  " foo ",
  " foo; bar() ",
  " for (;;) { foo; bar() }",
  " for (i = 0; i < junk; i++) { foo; bar() }",
  " for (i = 0, j = 0; i < junk; i++, j = j + 2) { foo; bar() }",
  " for ( i = 0,  j = 0;   i < junk;    i++,     j = j + 2) { foo; bar() }",
  " var foo = { x:3, y:\"Yes!\", 'n':'No.', \"double\":2.0 }",
  "var bar = [1, 2.0, 'three', +4, -5e1, 0x6]",
  " with (x) { foo.bar['none'].print(); }",
  " while (y < 10) { if (x = 9) break; if (z = 4) continue; y = y + 1; } return 'foo'; ",
  " ebony: while (y < 10) { if (x = 9) break ebony; if (z = 4) continue ivory; y = y + 1; } return 'foo'; ",
  // TODO: octal literals " x = 011",
  " switch (x) { case 2: console.log('foo'); break; default: console.log('bar'); }",
  "for (var i in x) {\n\tconsole.log(x)\n}",
  "do { console.log(1) } while (true); ",
  "throw 'new error';",
  "try { throw 'error' } catch (e) { console.log(e) }",
  "try { throw 'error' } finally { console.log('all clear') }",
  "try { throw 'error' } catch (e) { console.log(e) } finally { console.log('all clear') }",
  "debugger;",
  "x ? y : null",
  "x || y",
  "function foo() { return 'foo'; }",
  "foo = function bar() { return 'bar'; }",
  "var files = require('xjs').foo",
  "var files = require('fs').readdir(dir, function(err, files) { \n\
    for (var i in files) { \n\
      out.write(files[i]); \n\
    } \n\
    async.end(); \n\
  });"
].forEach(function (test) {
  exports[test] = function (assert) {
    try {
      var result = parser.parse("<?" + test + "?>");
    } catch (e) {
      console.log(e);
    }
    assert.equal(test, result[0].script);
    assert.done();
  };
});
