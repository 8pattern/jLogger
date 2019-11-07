import AppenderManager, { Appender, ConsoleAppender } from '../src/appender'

describe('Appender Manager', () => {
  describe('set works', () => {
    test('set valid appenders', () => {
      const appenderManager = new AppenderManager()
      expect(appenderManager.appenders.length).toBe(0)
  
      expect(appenderManager.set([new ConsoleAppender()])).toBe(1)
      expect(appenderManager.appenders.length).toBe(1)
    })
  
    test('set invalid appenders', () => {
      const appenderManager = new AppenderManager()
  
      expect(appenderManager.set([{} as Appender])).toBe(0)
      expect(appenderManager.appenders.length).toBe(0)
    })
  })

  test('get works', () => {
    const appenderManager = new AppenderManager()
    expect(appenderManager.get()).toBe(appenderManager.appenders)

    appenderManager.set([new ConsoleAppender()])
    expect(appenderManager.get()).toBe(appenderManager.appenders)
  })

  describe('register works', () => {
    test('register valid appenders', () => {
      const appenderManager = new AppenderManager()
      expect(appenderManager.appenders.length).toBe(0)

      appenderManager.register(new ConsoleAppender())
      expect(appenderManager.appenders.length).toBe(1)

      const consoleAppender = new ConsoleAppender()
      appenderManager.register(consoleAppender)
      expect(appenderManager.appenders.length).toBe(2)
      appenderManager.register(consoleAppender)
      expect(appenderManager.appenders.length).toBe(2)
    })
  
    test('register invalid appenders', () => {
      const appenderManager = new AppenderManager()
      expect(appenderManager.appenders.length).toBe(0)

      expect(() => appenderManager.register({} as Appender)).toThrow(Error)
      expect(appenderManager.appenders.length).toBe(0)
    })
  })

  describe('delete works', () => {
    test('delete success', () => {
      const appenderManager = new AppenderManager()
      const consoleAppender = new ConsoleAppender()
      
      appenderManager.register(consoleAppender)
      expect(appenderManager.appenders.length).toBe(1)

      expect(appenderManager.delete(consoleAppender)).toBeTruthy()
      expect(appenderManager.appenders.length).toBe(0)
    })

    test('delete fail', () => {
      const appenderManager = new AppenderManager()
      const consoleAppender = new ConsoleAppender()
      
      appenderManager.register(consoleAppender)
      expect(appenderManager.appenders.length).toBe(1)

      expect(appenderManager.delete(new ConsoleAppender())).toBeFalsy()
      expect(appenderManager.appenders.length).toBe(1)
    })
  })
})