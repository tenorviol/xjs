0.1.2
-----

* accept callback function or writable stream for render response
* automatic template/array loops
* command line xjs server

future
------

* seamless Express support
* when the file changes, reload the module
* inline xjs blocks
* auto conversion to html5, plus Schema checking
* exception stack trace line number
* namespace and custom tag support
* tag error checking

* Which is better?
    1. Writing many small strings to an http response stream.
    2. Concatenating the strings and writing one long string.

* Performance comparison
    Jade vs. xjs plus the apache baseline tests.
