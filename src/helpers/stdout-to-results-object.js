const fs = require('fs')

const codeToStatus = require('./code-to-status')

module.exports = stdoutToResultsObject

function stdoutToResultsObject (stdout, includeContent, cwd = '') {
  const results = stdout
    .split('\n')
    .reduce((results, line) => {
      if (line === '') return results
      const parts = line.split('\t')
      if (parts.length < 2) return results
      const result = {
        filename: parts[2] || parts[1],
        status: codeToStatus(parts[0])
      }
      if (includeContent) {
        try {
          result.content = fs.readFileSync(cwd + '/' + result.filename, {
            encoding: 'utf8'
          })
        } catch (err) {
          result.err = err
        }
      }
      results.push(result)
      return results
    }, [])
  return results
}
