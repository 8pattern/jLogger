import Appender from './Appender'

export default class AppenderManager {
  appenders: Appender[] = []

  set(appenders: Appender[]): number {
    const legalAppenders = appenders.filter(item => item instanceof Appender)
    this.appenders = legalAppenders
    return legalAppenders.length
  }

  get(): Appender[] {
    return this.appenders
  }

  register(appender: Appender): void {
    if (appender instanceof Appender) {
      if (!this.appenders.includes(appender)) {
        this.appenders.push(appender)
      }
    } else {
      throw new Error('the received appender seems not be extended from Appender')
    }
  }

  delete(appender: unknown): boolean {
    const preLen = this.appenders.length
    this.appenders = this.appenders.filter(item => item !== appender)
    return this.appenders.length !== preLen
  }
}
