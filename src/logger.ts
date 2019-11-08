import { LogArguments, LogConfig, defaultArguments, defaultConfig, Level, Category, Foramt } from './constant'
import { logTag } from './format'
import { deepMerge } from './util'
import AppenderManager, { ConsoleAppender } from './appender'
import { Decorator } from '@babel/types'

// the log called count
let count = 1

export default class Logger {
  private args: LogArguments
  private config: LogConfig
  Appender: AppenderManager = new AppenderManager()

  constructor(logArgs: LogArguments = {}, config: LogConfig = {}) {
    this.args = deepMerge(defaultArguments, logArgs)
    this.config = deepMerge(defaultConfig, config)
    this.logWrap = this.logWrap.bind(this)
    this.logDecorator = this.logDecorator.bind(this)
    this.init()
  }

  private init() {
    const levelConfig = this.config.level as Level
    Object.keys(levelConfig)
      .forEach((level) => {
        if (!this[level]) {
          this[level] = function(content: unknown = '', args: LogArguments = {}): LogArguments {
            return this.log(content, { level: levelConfig[level], ...args })
          }
        }
      })

    this.Appender.set([new ConsoleAppender()])
  }

  private print(printFields: LogArguments = {}): void {
    this.Appender.appenders.forEach((appender) => {
      appender.print(printFields)
    })
  }

  log(content: string | unknown = '', logArgs: LogArguments = {}): LogArguments {
    const logFields: LogArguments = {
      level: (this.config.level as Level).info,
      ...this.args,
      ...logArgs,
      timeStamp: Date.now(),
      count,
      content,
    }
    
    if (this.config.printLevel && this.config.printLevel.some(level => (this.config as Level).level[level] === logFields.level)) {
      try {
        const logContent = (this.config.format as Foramt)(logFields)
        this.print({ ...logFields, logContent })
      } catch (err) {
        console.error(`something wrong in log: ${err}`)
      }
      count += 1
      return logFields
    }
    return {}    
  }

  debug(content: unknown = '', args: LogArguments = {}): LogArguments {
    return this.log(content, { level: (this.config.level as Level).debug, ...args })
  }

  info(content: unknown = '', args: LogArguments = {}): LogArguments {
    return this.log(content, { level: (this.config.level as Level).info, ...args })
  }

  warn(content: unknown = '', args: LogArguments = {}): LogArguments {
    return this.log(content, { level: (this.config.level as Level).warn, ...args })
  }

  error(error: Error | any, args: LogArguments = {}): LogArguments {
    if (error instanceof Error) {
      const { name = '', message = '', stack = '' } = error
      return this.log(stack, { level: (this.config.level as Level).error, errType: name, errDesc: message, ...args })
    }
    return this.log(error, { level: (this.config.level as Level).error, ...args })
  }

  logWrap(wrapped: Function, logArgs: LogArguments = {}): Function {
    const _this = this
    return function (...funArgs: any[]) {
      const funName = wrapped.name || ''
      const category = (_this.config.category as Category).function
      _this.info(logTag`INPUT: ${funArgs}`, { category, funName, ...logArgs })
      try {
        const result = wrapped(...funArgs)
        _this.info(logTag`OUTPUT: ${funArgs}`, { category, funName, ...logArgs })
        return result
      } catch (err) {
        _this.error(err, { category, funName, ...logArgs })
      }
    }
  }

  logDecorator(logArgs: LogArguments = {}) {
    return (target: Object, name: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
      const className = target.constructor.name
      // const funName = name
      const wrapped = descriptor.value
      if (wrapped) {
        descriptor.value = this.logWrap(wrapped, { className, ...logArgs })
      }
      return descriptor
    }
  }
}
