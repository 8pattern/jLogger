import { LogArguments, Foramt } from '../constant'

export interface AppenderConfig {
  format?: Foramt
  [key: string]: any
}

export default abstract class Appender {
  protected config: AppenderConfig
  
  constructor(config: AppenderConfig = {}) {
    this.config = config
  }

  getPrintContent(printFields: LogArguments): string {
    const { format } = this.config
    return format ? format(printFields) : printFields.logContent
  }

  abstract print(printFields: LogArguments): void
}
