import fs from 'fs'
import path from 'path'

import Appender, { AppenderConfig as ParentAppenderConfig } from './Appender'
import { LogArguments } from '../constant'
import { dateformat } from '../format'

interface ChildLogConfig {
  filePath?: string
  fileName?: string
  fileExtension?: string
  only?: boolean
}

interface getChildConfig {
  (logFields: LogArguments): ChildLogConfig
}

interface AppenderConfig extends ParentAppenderConfig {
  filePath?: string
  fileName?: string
  fileExtension?: string
  childConfigRule?: null | ChildLogConfig | getChildConfig
}

const defaultAppenderConfig: AppenderConfig = {
  filePath: './',
  fileName: `${dateformat(Date.now(), 'yyyy-mm-dd')}`,
  fileExtension: 'log',
  childConfigRule: null,
}

export default class ConsoleAppender extends Appender {
  protected config: AppenderConfig

  constructor(config: AppenderConfig = {}) {
    super(config)
    this.config = {
      ...super.config,
      ...defaultAppenderConfig,
      ...config
    }

    this.init()
  }

  private init() {
    this.makeLogDir(this.config.filePath as string)
  }

  private makeLogDir(dirName: string): boolean {
    if (fs.existsSync(dirName)) {
      return true
    }
    if (this.makeLogDir(path.dirname(dirName))) {
      console.log(`the log dir didn't exist and it is created: ${dirName}`)
      fs.mkdirSync(dirName)
      return true
    }
    return false
  }

  private writeToFile(file: string, content: string): Promise<null | Error> {
    return new Promise((resolve, reject) => {
      fs.appendFile(file, content, (err) => {
        if (err) {
          console.error(`print log file error: ${err}`)
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  print(logField: LogArguments): void {
    const content = this.getPrintContent(logField)
    let isOnlyPrintChildLog = false
    const { filePath, fileName, fileExtension, childConfigRule } = this.config
    if (childConfigRule) {
      const childConfig = (typeof childConfigRule === 'function') ? childConfigRule(logField) : childConfigRule
      const {
        filePath: childFilePath = filePath,
        fileName: childFileName = fileName,
        fileExtension: childFileExtension = fileExtension,
        only = false
      } = childConfig
      this.writeToFile(`${childFilePath}/${childFileName}.${childFileExtension}`, content)
      isOnlyPrintChildLog = only
    }

    if (!isOnlyPrintChildLog) {
      this.writeToFile(`${filePath}/${fileName}.${fileExtension}`, content)
    }
  }
}
