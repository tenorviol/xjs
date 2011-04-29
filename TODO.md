0.1.5
-----

* simpler xjs.render / view arch aping express
* namespace and custom tag support
* parent tag access within the children render block

future
------

* In express, res.render does not deal with the possibility of an
  asynchronous render method. This does not play well with xjs,
  but please confirm.
* seamless Express support. This is a real problem and so far unresolvable
* auto conversion to html5, plus Schema checking
* exception stack trace line number
* tag error checking, read DTD/Schema
* test xjsserver
* how inefficient are the nested with statements?
* rewrite the parser in c++ by extending v8's parser.cc

* Which is better?
    1. Writing many small strings to an http response stream.
    2. Concatenating the strings and writing one long string.

* Performance comparison
    Jade vs. xjs plus the apache baseline tests.
