case 4
======

Storage and re-use of an internal template

### case4.xjs

    <?
      var name = 'Chris Johnson';
      var name_template = <span class="name"><?= name ?></span>;
    ?>
    <div>
      I love you <?= name_template ?>
    </div>

### expected output

    <div>
      I love you <span class="name">Chris Johnson</span>
    </div>

### javascript

    function (out, globals) {
      use (globals) {
        var name = 'Chris Johnson';
        var name_template = function (out) {
          out.raw('<span class="name">');
          out.write(name);
          out.raw('</span>');
        };
        out.raw('<div>\n  I love you ');
        out.write(name_template);
        out.raw('</div>');
      }
    }
