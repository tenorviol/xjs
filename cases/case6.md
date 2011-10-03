case 6
======

Custom tag rendering with an inner template.

### setup

    xjs.registerTag('mongo:find', function (out, attr, inner) {
      out = out.async();
      mongo.collection(attr.collection).find(attr.query).each(function (doc) {
        inner.apply(doc, out);
      });
      // TODO: close out
    });

### case6.xjs

    <mongo:find db="foo" collection="bar">
      <div id="{this._id}"><?= this._id ?></div>
    </mongo:find>

### expected output

    <div id="3">3</div>
    <div id="4">4</div>
    etc.

### javascript

    function (out, globals) {
      use (globals) {
        out.tag('mongo:find', { db:'foo', collection:'bar' }, function (out, attr) {
          out.raw('<div id="');
          out.write(this._id);
          out.raw('">');
          out.write(this._id);
          out.raw('</div>');
        });
      };
    }
