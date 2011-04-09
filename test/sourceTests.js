
module.exports = [

  // write block using passed-in local variable
  {
    source: '{{=foo}}',
    parse: [ { type:'write', source:'{{=foo}}', script:'foo' } ],
    locals: { foo:'bar' },
    render: 'bar'
  },

  // 'Hello world!'
  // wth write block calling passed-in function
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

  // write block with semicolon
  {
    source: '{{= fubar; }}',
    parse: [ { type:'write', source:'{{= fubar; }}', script:' fubar; ' } ],
    locals: { fubar:'<>"&' },
    render: '&lt;&gt;&quot;&amp;'
  },

  // simple tag test
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
  }
];
