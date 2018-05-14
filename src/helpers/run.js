var spawn = require("child_process").spawn;

module.exports = function run (command, debug, callback) {
  if (debug) {
    console.log("RUNNING: " + command);
  }

  var bits = command.split(" ");
  var args = bits.slice(1);

  var cmd = spawn(bits[ 0 ], args, {
    cwd: module.exports.cwd
  });

  var stdout = "";
  var stderr = "";

  cmd.stdout.on('data', function (data) {
    stdout += data.toString();
  });

  cmd.stderr.on('data', function (data) {
    stderr += data.toString();
  });

  cmd.on("close", function (code) {
    var err = null;

    if (code !== 0) {
      err = new Error(stderr);
    }

    callback(err, stdout, stderr);
  });
}
