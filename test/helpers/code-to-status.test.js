const codeToStatus = require('../../src/helpers/code-to-status')

describe('codeToStatus() handler', () => {
  const map = {
    'A': 'Added',
    'C': 'Copied',
    'D': 'Deleted',
    'M': 'Modified',
    'R': 'Renamed',
    'T': 'Type-Change',
    'U': 'Unmerged',
    'X': 'Unknown',
    'B': 'Broken'
  }

  Object
    .entries(map)
    .forEach(([code, status]) => {
      it(`returns status '${status}' from code '${code}'`, () => {
        expect(codeToStatus(code)).toBe(status)
      })
    })
})
