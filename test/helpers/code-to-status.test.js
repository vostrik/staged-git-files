describe('Code to status handler', () => {
  const statusMap = require('../../src/helpers/code-to-status')

  test('Code \'A\' should return status \'Added\'', () => {
    expect(statusMap('A')).toBe('Added')
  })

  test('Code \'C\' should return status \'Copied\'', () => {
    expect(statusMap('C')).toBe('Copied')
  })

  test('Code \'D\' should return status \'Deleted\'', () => {
    expect(statusMap('D')).toBe('Deleted')
  })

  test('Code \'M\' should return status \'Modified\'', () => {
    expect(statusMap('M')).toBe('Modified')
  })

  test('Code \'R\' should return status \'Renamed\'', () => {
    expect(statusMap('R')).toBe('Renamed')
  })

  test('Code \'T\' should return status \'Type-Change\'', () => {
    expect(statusMap('T')).toBe('Type-Change')
  })

  test('Code \'U\' should return status \'Unmerged\'', () => {
    expect(statusMap('U')).toBe('Unmerged')
  })

  test('Code \'X\' should return status \'Unknown\'', () => {
    expect(statusMap('X')).toBe('Unknown')
  })

  test('Code \'B\' should return status \'Broken\'', () => {
    expect(statusMap('B')).toBe('Broken')
  })
})
