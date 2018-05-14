var fs = require("fs");

var helpers = require("../helpers/index")

var sgf = function(filter, callback) {

    if (typeof filter == "function") {
        callback = filter;
        filter = "ACDMRTUXB";
    }

    sgf.getHead(function(err, head) {
        if (err) {
            callback(err);
        } else {
            var command = "git -c core.quotepath=false diff-index --cached --name-status";

            if (filter.indexOf('R') !== -1) {
                command += " -M";
            }

            command += " --diff-filter=" + filter + " " + head;

            helpers.run(command, sgf.debug, function(err, stdout, stderr) {
                if (err || stderr) {
                    callback(err || new Error(stderr));
                } else {
                    callback(
                        null,
                        helpers.stdoutToResultsObject(
                            stdout,
                            sgf.includeContent,
                            sgf.cwd
                        )
                    );
                }
            });
        }
    });
}

sgf.cwd = process.cwd();
sgf.debug = false;
sgf.includeContent = false;

sgf.firstHead = "4b825dc642cb6eb9a060e54bf8d69288fbee4904";

sgf.getHead = function(callback) {
    helpers.run("git rev-parse --verify HEAD", function(err, stdout, stderr) {
        if (err && err.message.indexOf("fatal: Needed a single revision")!==-1) {
            callback(null, sgf.firstHead);
        } else if (err || stderr) {
            callback(err || new Error("STDERR: " + stderr));
        } else {
            stdout = stdout.replace("\n", "");
            callback(null, stdout);
        }
    });
}

sgf.readFile = function(filename, options, callback) {
    fs.readFile(sgf.cwd + "/" + filename, options, callback);
}

module.exports = sgf