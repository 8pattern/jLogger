import { getRandomNumber } from './util'

export interface Category {
  [key: string]: string
}
export interface Level {
  [level: string]: string
}
export interface Foramt {
  (logFields: LogArguments): string
}

export interface LogArguments {
  [key: string]: any
}

export interface LogConfig {
  category?: Category
  level?: Level
  format?: Foramt
  contentLengthLimit?: number | null
  timeStampFormat?: string
  printLevel?: string[]
  [key: string]: any
}

export const defaultArguments: LogArguments = {
  wid: getRandomNumber(5),
  url: window.location.href.replace(window.location.origin, ''),
}

export const defaultConfig: LogConfig = {
  category: {
    notice: 'NOTICE',
    action: 'ACTION',
    function: 'FUNCTION',
  },
  level: {
    error: 'ERROR',
    warn: 'WARN',
    info: 'INFO',
    debug: 'DEBUG',
  },
  format: (logArgs) => JSON.stringify(logArgs),
  printLevel: ['debug', 'info', 'warn', 'error'],
}
