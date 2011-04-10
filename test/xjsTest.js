var xjs = require('../lib/xjs'),
    parser = require('../lib/parser');


var tests = [

  // 'Hello world!'
  // with write block calling passed-in function
  {
    source: '{{=foo}}{{=bar()}}',
    parse: [
      { type:'write', source:'{{=foo}}', script:'foo' },
      { type:'write', source:'{{=bar()}}', script:'bar()' }
    ],
    locals: {
      foo:'Hello ',
      bar:function() { return 'world!'; }
    },
    render: 'Hello world!'
  },

  // write block with trailing semicolon
  {
    source: '{{= fubar; }}',
    parse: [ { type:'write', source:'{{= fubar; }}', script:' fubar; ' } ],
    locals: { fubar:'<>"&' },
    render: '&lt;&gt;&quot;&amp;'
  },

  // simple tag
  // using in-template variable assignment
  {
    source: '{{ var foo = "bar"; }}<div>{{= foo }}</div>',
    parse: [
      {
        type:'script',
        source:'{{ var foo = "bar"; }}',
        script:' var foo = "bar"; '
      },
      {
        type:'tag',
        open: { start:'<div', end:'>', name:'div', attributes:[] },
        children:[
          { type:'write', source:'{{= foo }}', script:' foo ' }
        ],
        close: { source:'</div>', name:'div' }
      }
    ],
    render: '<div>bar</div>'
  },

  // checking access to typical node.js globals
  // i.e. process, console, require
  {
    source: '{{ var qs = require("querystring"); }}'
          + '{{= qs.stringify({ foo:"bar" }) }}'
          + '{{= process.version;;; }}'
          + '{{= console.log ? true : false }}',
    parse: [
      { type: 'script', source: '{{ var qs = require("querystring"); }}', script: ' var qs = require("querystring"); '},
      { type: 'write', source: '{{= qs.stringify({ foo:"bar" }) }}', script: ' qs.stringify({ foo:"bar" }) '},
      { type: 'write', source: '{{= process.version;;; }}', script: ' process.version;;; ' },
      { type: 'write', source: '{{= console.log ? true : false }}', script: ' console.log ? true : false ' }
    ],
    render: 'foo=bar' + process.version + 'true'
  },

  // null and undefined are javascript's non-objects
  // they have no properties and will not be written
  {
    source: '{{= undefined }}{{= null }}',
    parse: [
      { type: 'write', source: '{{= undefined }}', script: ' undefined ' },
      { type: 'write', source: '{{= null }}', script: ' null ' }
    ],
    render: ''
  },

  // writing a function should not dump code automatically
  // to dump code, call the function's toString() method
  {
    source: '{{=func}}',
    parse: [ { type:'write', source:'{{=func}}', script:'func' } ],
    locals: { func:function() { return very_secure_code; } },
    render: '[Function]'
  },

  // empty space between tags will be removed
  {
    source: '<ul> <li>foo</li> <li>bar</li> </ul>',
    parse: [
      {
        type:'tag',
        open: { start:'<ul', end:'>', name:'ul', attributes:[] },
        children:[
          { type:'pcdata', source:' ' },
          {
            type:'tag',
            open: { start:'<li', end:'>', name:'li', attributes:[] },
            children:[
              { source:'foo', type:'pcdata' }
            ],
            close: { source:'</li>', name:'li' }
          },
          { type:'pcdata', source:' ' },
          {
            type:'tag',
            open: { start:'<li', end:'>', name:'li', attributes:[] },
            children:[
              { source:'bar', type:'pcdata' }
            ],
            close: { source:'</li>', name:'li' }
          },
          { type:'pcdata', source:' ' }
        ],
        close: { source:'</ul>', name:'ul' }
      }
    ],
    render: '<ul><li>foo</li><li>bar</li></ul>'
  }

  // attributes can be defined by expression blocks
/*  {
    source: '<div id={foo}>bar</div>',
    locals: { foo:'Fubar!' },
    render: '<div id="Fubar!">bar</div>'
  }
*/
];


tests.forEach(function(test) {

  exports['parse '+test.source] = function(assert) {
    var result = parser.parse(test.source);
    assert.deepEqual(test.parse, result);
    assert.done();
  };

  exports['render ' + test.source] = function(assert) {
    var template = xjs.parse(test.source);
    template.render(test.locals, function(result) {
      assert.equal(test.render, result);
      assert.done();
    });
  };

});
