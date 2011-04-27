0.1.4
-----

* seamless Express support

* when the file changes, reload the module
* namespace and custom tag support

future
------

* In express, res.render does not deal with the possibility of an
  asynchronous render method. This does not play well with xjs,
  but please confirm.
* auto conversion to html5, plus Schema checking
* exception stack trace line number
* tag error checking, read DTD/Schema
* test xjsserver
* how inefficient are the nested with statements?

* Which is better?
    1. Writing many small strings to an http response stream.
    2. Concatenating the strings and writing one long string.

* Performance comparison
    Jade vs. xjs plus the apache baseline tests.
