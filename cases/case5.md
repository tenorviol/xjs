case 5
======

custom tag rendering
NOTE: It should not be allowed to register tags from within an xjs template,
      because it's too confusing what the fuck is going on.

### setup

    xjs.registerTag('my:name', function (out, attributes) {
      out.raw('<span class="name">');
      out.write(attributes.name);
      out.raw('</span>');
    });

### case5.xjs

    <my:name name="Chris Johnson" />

### expected output

    <span class="name">Chris Johnson</span>

### javascript

    function (out, globals) {
      use (globals) {
        xjs.registerTag('my', 'name', function (out, parent) {
          out.raw('<span class="name">');
          out.write(parent.name);
          out.raw('</span>');
        });
        out.tag('my:name', { name:'Chris Johnson' });
      }
    }
