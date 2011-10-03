case 1
------

Rendering local variables.
All variable rendering should be html-safe.

### case1.xjs

    <?
      var foo = '<<< This is so great! >>>';
    ?>
    <p><?= foo ?></p>

### connect rendering

    app.get('/', xjs.render(__dirname + '/cases/case1.xjs'));

### expected output

    <p>&lt;&lt;&lt; This is so great! &gt;&gt;&gt;</p>

### javascript

    function (out) {
      var foo = '<<< This is so great! >>>';
      out.raw('<p>');
      out.write(foo);
      out.raw('</p>');
    }
