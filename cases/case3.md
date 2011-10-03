case 3
======

Outputting raw data by direct out access.

### case2.xjs

    <?
      var html = '<p>Pre-rendered crap (hopefully safe)</p>';
    ?>
    <div><? out.raw(html) ?></div>

### connect rendering

    app.get('/', res.render(__dirname + '/cases/case3.xjs');

### expected output

    <div><p>Pre-rendered crap (hopefully safe)</p></div>

### javascript

    function (out, globals) {
      use (globals) {
        var html = '<p>Pre-rendered crap (hopefully safe)</p>';
        out.raw('<div>');
        out.raw(html);
        out.raw('</div>');
      }
    }
