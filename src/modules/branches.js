var helpers = require('../helpers/index')

var diffGitFiles = function (sourceBranch, targetBranch, filter, callback) {
  if (typeof filter === 'function') {
    callback = filter
    filter = 'ACDMRTUXB'
  }

  var command = 'git -c core.quotepath=false diff --name-status ' + sourceBranch + ' ' + targetBranch

  if (filter.indexOf('R') !== -1) {
    command += ' -M'
  }

  command += ' --diff-filter=' + filter
  console.log(command)
  helpers.run(command, diffGitFiles.debug, function (err, stdout, stderr) {
    if (err || stderr) {
      callback(err || new Error(stderr))
    } else {
      callback(
        null,
        helpers.stdoutToResultsObject(
          stdout,
          diffGitFiles.includeContent,
          diffGitFiles.cwd
        )
      )
    }
  })
}

diffGitFiles.cwd = process.cwd()
diffGitFiles.debug = false
diffGitFiles.includeContent = false

module.exports = diffGitFiles