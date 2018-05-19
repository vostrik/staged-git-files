describe('Run handler', () => {
  test('Should read node version', () => {
    const run = require('../../src/helpers/run')

    run('node -v', false, (err, stdout, stderr) => {
      expect(err).toBeNull()

      expect(typeof stdout).toBe('string')

      expect(stdout.trim()).toBe(process.version)

      expect(stderr).toBeFalsy()
    })
  })

  test('Should process debug flag', () => {
    global.console = {
      log: jest.fn()
    }

    const run = require('../../src/helpers/run')

    run('node -v', true, () => {
      expect(global.console.log).toHaveBeenCalledWith('RUNNING: node -v')
    })
  })
})
