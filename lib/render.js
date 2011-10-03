var fs = require('fs');

module.exports = renderXjsFile;

function renderXjsFile(filename) {
  var render = require(filename);
  return function (req, res, next) {
    render(function (result) {
      res.end(result);
    }, { req:req, res:res });
  };
}
