import Appender, { AppenderConfig as ParentAppenderConfig } from './Appender'
import { LogArguments, defaultConfig, Level } from '../constant'
import { isNode } from '../util'

interface AppenderConfig extends ParentAppenderConfig {
  colorScheme?: {
    [level: string]: [string, string?]
  }
}

const defaultAppenderConfig: AppenderConfig = {
  colorScheme: {
    DEBUG: ['#274e13', '#b6d7a8'],
    INFO: ['#073763', '#b6d7a8'],
    default: ['#000000', '#d3d3d3'],
  }
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
  }

  print(logField: LogArguments): void {
    const content = this.getPrintContent(logField)
    const {
      level = null,
    } = logField

    const defaultLevel = defaultConfig.level as Level
    const consoleLog = ({
      [defaultLevel.debug]: console.debug,
      [defaultLevel.info]: console.info,
      [defaultLevel.warn]: console.warn,
      [defaultLevel.error]: console.error,
      null: console.log,
    })[level]

    const { colorScheme } = this.config
    if (!colorScheme || !isNode) {
      consoleLog(content)
    } else {
      const [fontColor, bgColor] = colorScheme[level] || colorScheme['default']
      if (fontColor || bgColor) {
        consoleLog(`%c${content}`, `${fontColor ? `color: ${fontColor}` : ''}${bgColor ? `background-color: ${bgColor};` : ''}`)
      } else {
        consoleLog(content)
      }
    }
  }
}
