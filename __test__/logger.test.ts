import Logger from '../src/logger'

describe('initialize', () => {
  test('default', () => {
    const logger = new Logger()
    expect(logger['args']).toMatchObject({
      wid: expect.any(Number),
      url: expect.any(String),
    })
    expect(logger['config']).toMatchObject({
      category: expect.any(Object),
      level: expect.any(Object),
    })
  })

  test('custom arguments', () => {
    const logger = new Logger({ t: 'text', o: { a: 1, b: 2 } })
    expect(logger['args']).toMatchObject({
      wid: expect.any(Number),
      url: expect.any(String),
      t: 'text',
      o: { a: 1, b: 2 },
    })
    expect(logger['config']).toMatchObject({
      category: expect.any(Object),
      level: expect.any(Object),
    })
  })

  test('custom config', () => {
    const logger = new Logger({}, { t: 'test' })
    expect(logger['args']).toMatchObject({
      wid: expect.any(Number),
      url: expect.any(String),
    })
    expect(logger['config']).toMatchObject({
      category: expect.any(Object),
      level: expect.any(Object),
      t: 'test',
    })
  })
})

describe('log', () => {
  describe('default config', () => {
    const logger = new Logger()
    logger.log = jest.fn()
    
    test('debug', () => {
      logger.debug('test debug')
      expect(logger.log).toHaveBeenLastCalledWith(
        'test debug',
        expect.objectContaining({
          level: expect.stringMatching(/debug/i)
        }),
      )
    })
  
    test('info', () => {
      logger.info('test info')
      expect(logger.log).toHaveBeenLastCalledWith(
        'test info',
        expect.objectContaining({
          level: expect.stringMatching(/info/i)
        }),
      )
    })

    test('warn', () => {
      logger.warn('test warn')
      expect(logger.log).toHaveBeenLastCalledWith(
        'test warn',
        expect.objectContaining({
          level: expect.stringMatching(/warn/i)
        }),
      )
    })

    test('error', () => {
      logger.error('test error')
      expect(logger.log).toHaveBeenLastCalledWith(
        'test error',
        expect.objectContaining({
          level: expect.stringMatching(/error/i)
        }),
      )
    })
  })

  describe('custom level config', () => {
    const logger = new Logger({}, {
      level: {
        info: 'trace',
        fatal: 'fatal'
      }
    })
    logger.log = jest.fn()

    test('custom info level', () => {
      logger.info('test custom info')
      expect(logger.log).toHaveBeenLastCalledWith(
        'test custom info',
        expect.objectContaining({
          level: 'trace',
        }),
      )
    })

    test('custom fatal level', () => {
      expect(logger['fatal']).toBeDefined()
      logger['fatal']('test custom fatal')
      expect(logger.log).toHaveBeenLastCalledWith(
        'test custom fatal',
        expect.objectContaining({
          level: 'fatal',
        }),
      )
    })
  })
})

describe('print', () => {
})