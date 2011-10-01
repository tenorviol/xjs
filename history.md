0.1.5
-----



0.1.4 / 2011-04-29
------------------

* refactored stream class
* XjsStream now escapes strings by default; use writeRaw for not that
* Single '{'s can  now be used in PCDATA

0.1.3
-----

* added inline xjs blocks
* automatically loop through local arrays

0.1.2 / 2011-04-11
------------------

* `render(response)` can now be a callback function or a writable stream
* added command line xjsserver, a simple way of serving xjs

0.1.1 / 2011-04-11
-----------------

* Reversed the order of parameters: `render(response, local)`
* Fixed bug due to leading/trailing whitespace in code blocks

0.1.0 / 2011-04-11
------------------

* Initial release