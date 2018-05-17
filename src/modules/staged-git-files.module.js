const BaseModule = require('./base.module')

module.exports = class StagedGitFiles extends BaseModule {
  /**
   * Get list of staged files
   * @param {string} filter - filter string for file modificators ('ACDMRTUXB')
   * @param {function} callback - callback to handle result
   */
  runCommand ({ filter, callback } = {}) {
    this.getHead((err, head) => {
      if (err) {
        callback(err)
        return
      }
      let command = ''
      command += 'git -c core.quotepath=false diff-index --cached --name-status'
      if (filter.indexOf('R') !== -1) {
        command += ' -M'
      }
      command += ` --diff-filter=${filter} ${head}`
      super.runCommand({
        filter,
        command,
        callback
      })
    })
  }
}
