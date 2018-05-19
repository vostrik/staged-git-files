const stdoutToResultsObject = require('../../src/helpers/stdout-to-results-object')

describe('stdoutToResultsObject() handler', () => {
  it('returns list of file statuses', () => {
    const stdout = 'A\tindex.js\nM\ttest.js'
    const results = [
      {
        filename: 'index.js',
        status: 'Added'
      },
      {
        filename: 'test.js',
        status: 'Modified'
      }
    ]
    expect(stdoutToResultsObject(stdout)).toEqual(results)
  })

  it('returns list of file statuses with content on flag includeContent=true', () => {
    
  })

  it('returns list of file statuses with content error on missed files', () => {
    const stdout = 'A\tindex.js\nM\ttest.js'
    const results = [
      {
        err: new Error('ENOENT: no such file or directory, open \'/index.js\''),
        filename: 'index.js',
        status: 'Added'
      },
      {
        err: new Error('ENOENT: no such file or directory, open \'/test.js\''),
        filename: 'test.js',
        status: 'Modified'
      }
    ]
    expect(stdoutToResultsObject(stdout, true)).toEqual(results)
  })
})
