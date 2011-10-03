/**
 * Copyright (C) 2011 by Christopher Johnson
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var xjs = require('../lib/xjs'),
    parser = require('../lib/parser');


var tests = [

  // 'Hello world!'
  // with write block calling passed-in function
  {
    source: '<?=foo?><?=bar()?>',
    parse: [
      { type:'write', source:'<?=foo?>', script:'foo' },
      { type:'write', source:'<?=bar()?>', script:'bar()' }
    ],
    local: {
      foo:'Hello ',
      bar:function() { return 'world!'; }
    },
    render: 'Hello world!'
  },

  // write block with trailing semicolon
  {
    source: '<?= fubar ?>',
    parse: [ { type:'write', source:'<?= fubar ?>', script:' fubar ' } ],
    local: { fubar:'<>"&' },
    render: '&lt;&gt;&quot;&amp;'
  },

  // simple tag
  // using in-template variable assignment
  {
    source: '<? var foo = "bar"; ?><div><?= foo ?></div>',
    parse: [
      {
        type:'script',
        source:'<? var foo = "bar"; ?>',
        script:' var foo = "bar"; '
      },
      {
        type:'tag',
        open: { start:'<div', end:'>', name:'div', attributes:[] },
        children:[
          { type:'write', source:'<?= foo ?>', script:' foo ' }
        ],
        close: { source:'</div>', name:'div' }
      }
    ],
    render: '<div>bar</div>'
  },

  // checking access to typical node.js globals
  // i.e. process, console, require
  {
    source: '<? var qs = require("querystring"); ?>'
          + '<?= qs.stringify({ foo:"bar" }) ?>'
          + '<?= process.version ?>'
          + '<?= console.log ? true : false ?>',
    parse: [
      { type: 'script', source: '<? var qs = require("querystring"); ?>', script: ' var qs = require("querystring"); '},
      { type: 'write', source: '<?= qs.stringify({ foo:"bar" }) ?>', script: ' qs.stringify({ foo:"bar" }) '},
      { type: 'write', source: '<?= process.version ?>', script: ' process.version ' },
      { type: 'write', source: '<?= console.log ? true : false ?>', script: ' console.log ? true : false ' }
    ],
    render: 'foo=bar' + process.version + 'true'
  },

  // null and undefined are javascript's non-objects
  // they have no properties and will not be written
  {
    source: '<?= undefined ?><?= null ?>',
    parse: [
      { type: 'write', source: '<?= undefined ?>', script: ' undefined ' },
      { type: 'write', source: '<?= null ?>', script: ' null ' }
    ],
    render: ''
  },

  // writing a function should not dump code automatically
  // to dump code, call the function's toString() method
  {
    source: '<?=func?>',
    parse: [ { type:'write', source:'<?=func?>', script:'func' } ],
    local: { func:function() { return very_secure_code; } },
    render: '[Function]'
  },
/* TODO:
  // writing tags should just work
  {
    source: '<div><?= <span>Foo</span> ?></div>',
    parse: [ { type: 'tag',
        open: { start: '<div', end: '>', name: 'div', attributes: [] },
        children: 
         [ { type: 'write',
             source: '<?= <span>Foo</span> ?>',
             script: 
              [ ' ',
                { type: 'tag',
                  open: 
                   { start: '<span',
                     end: '>',
                     name: 'span',
                     attributes: [] },
                  children: [ { type: 'pcdata', source: 'Foo' } ],
                  close: { source: '</span>', name: 'span' } },
                ' ' ] } ],
        close: { source: '</div>', name: 'div' } } ],
    render: '<div><span>Foo</span></div>'
  },
*/
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
  },

  // static xml attribute
  {
    source: '<div id="foo">bar</div>',
    parse: [
      {
        type:'tag',
        open: { start:'<div', end:'>', name:'div', attributes:[
          { type:'attribute', source:' id=', name:'id', value:'foo' }
        ]},
        children: [ { type: 'pcdata', source: 'bar' } ],
        close: { source:'</div>', name:'div' }
      }
    ],
    render: '<div id="foo">bar</div>'
  },

  // xml attributes set by expression blocks
  {
    source: '<div id={foo}>bar</div>',
    parse: [
      {
        type:'tag',
        open: { start:'<div', end:'>', name:'div', attributes:[
          {
            source:' id=',
            type:'attribute',
            name:'id',
            value: {
              type:'expression',
              source:'{foo}',
              script:'foo'
            }
          }
        ]},
        children:[
          { type:'pcdata', source:'bar' }
        ],
        close: { source:'</div>', name:'div' }
      }
    ],
    local: { foo:'Fubar!' },
    render: '<div id="Fubar!">bar</div>'
  },
  
  {
    source : '<?= foo // bar ?>',
    parse : [
      { type :'write', source:'<?= foo // bar ?>', script:' foo // bar ' }
    ],
    local : { foo : 'Fubar!' },
    render : 'Fubar!'
  },
  
  {
    source : '<?= foo /* ?> */ ?>',
    parse : [
      { type :'write', source:'<?= foo /* ?> */ ?>', script:' foo /* ?> */ ' }
    ],
    local : { foo : 'Fubar!' },
    render : 'Fubar!'
  }

];


tests.forEach(function(test) {

  exports['parse '+test.source] = function(assert) {
    var result = parser.parse(test.source);
    assert.deepEqual(test.parse, result);
    assert.done();
  };

  exports['render ' + test.source] = function(assert) {
    var template = xjs.parse(test.source);
    template.render(function(result) {
      assert.equal(test.render, result);
      assert.done();
    }, test.local);
  };

});
