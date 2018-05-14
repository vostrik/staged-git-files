var helpers = require('./index')

module.exports = function stdoutToResultsObject (stdout, includeContent, cwd) {
  var results = [];
  var lines = stdout.split("\n");
  var iLines = lines.length;
  var files_with_errors = 0;
  while (iLines--) {
    var line = lines[ iLines ];
    if (line != "") {
      var parts = line.split("\t");
      var result = {
        filename: parts[ 2 ] || parts[ 1 ],
        status: helpers.codeToStatus(parts[ 0 ])
      }

      if (includeContent) {
        try {
          result.content = fs.readFileSync(cwd + "/" + result.filename, {
            encoding: "utf8"
          });
        } catch (err) {
          result.err = err;
        }
      }

      results.push(result);
    }
  }
  return results;
}
