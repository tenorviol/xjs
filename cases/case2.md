case 2
======

Rendering variables passed in via globals object.

### case2.xjs

    <p><?= foo ?></p>

### connect rendering

    app.get('/', res.render(__dirname + '/cases/case2.xjs', { foo : '"Love it!"' });

### expected output

    <p>&quot;Love it!&quot;</p>

### javascript

    function (out, globals) {
      use (globals) {
        out.raw('<p>');
        out.write(foo);
        out.raw('</p>');
      };
    }
