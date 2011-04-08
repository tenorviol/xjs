
module.exports = [

  {
    source: '{{=foo}}',
    parse: [ { type:'write', source:'{{=foo}}', script:'foo' } ],
    locals: { foo:'bar' },
    render: 'bar'
  },

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

  {
    source: '{{= fubar; }}',
    parse: [ { type:'write', source:'{{= fubar; }}', script:' fubar; ' } ],
    locals: { fubar:'<>"&' },
    render: '&lt;&gt;&quot;&amp;'
  },

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

  {
    source: '{{= require("querystring").stringify({ foo:"bar" }) }}',
    parse: [
      {
        type: 'write',
        source: '{{= require("querystring").stringify({ foo:"bar" }) }}',
        script: ' require("querystring").stringify({ foo:"bar" }) '
      }
    ],
    render: 'foo=bar'
  },

  {
    source: '{{= process.version }}{{= console.log ? true : false }}',
    parse: [
      { type: 'write', source: '{{= process.version }}', script: ' process.version ' },
      { type: 'write', source: '{{= console.log ? true : false }}', script: ' console.log ? true : false ' }
    ],
    render: process.version + 'true'
  }

];
