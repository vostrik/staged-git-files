const { defaultTargetBranch } = require('../constants')
const BaseModule = require('./base.module')

class diffGitFiles extends BaseModule {
  /**
   * Get list of diff files
   * @param {string} sourceBranch - branch with changes
   * @param {string} targetBranch - destination branch (for ex.: origin/master)
   * @param {string} filter - filter string for file modificators ('ACDMRTUXB')
   * @param {function} callback - callback to handle result
   */
  runCommand ({
    sourceBranch,
    targetBranch = defaultTargetBranch,
    filter,
    callback
  } = {}) {
    let command = 'git -c core.quotepath=false diff --name-status '
    command += `${targetBranch} ${sourceBranch}`
    if (filter.indexOf('R') !== -1) {
      command += ' -M'
    }
    command += ' --diff-filter=' + filter
    super.runCommand({
      filter,
      command,
      callback
    })
  }
}

module.exports = diffGitFiles