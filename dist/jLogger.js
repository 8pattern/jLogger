(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('util'), require('fs'), require('path')) :
  typeof define === 'function' && define.amd ? define(['exports', 'util', 'fs', 'path'], factory) :
  (global = global || self, factory(global.jLogger = {}, global.util$1, global.fs, global.path));
}(this, (function (exports, util$1, fs, path) { 'use strict';

  fs = fs && fs.hasOwnProperty('default') ? fs['default'] : fs;
  path = path && path.hasOwnProperty('default') ? path['default'] : path;

  function getRandomNumber(numDigit = 1) {
      return Math.floor(Math.random() * (10 ** numDigit));
  }
  function deepMerge(object1 = {}, object2 = {}) {
      const result = { ...object1, ...object2 };
      Object.keys(object1).forEach((key) => {
          const value1 = object1[key];
          const value2 = object2[key];
          if (value1.constructor.name === 'Object' && value2 && value2.constructor.name === 'Object') {
              result[key] = deepMerge(value1, value2);
          }
      });
      return result;
  }
  const isNode = (typeof global === 'object');

  const defaultArguments = isNode ? {
      pid: process.pid,
  } : {
      wid: getRandomNumber(5),
      url: window.location.href.replace(window.location.origin, ''),
  };
  const defaultConfig = {
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
  };

  function formatArgumentForPrint(argItem) {
      if (util$1.isNullOrUndefined(argItem)) {
          return `${argItem}`;
      }
      switch (typeof argItem) {
          case 'function':
              const functionName = argItem.name;
              return functionName ? `-Function[${functionName}]-` : '-Function-';
          case 'object':
              const constructorName = argItem.constructor.name;
              switch (constructorName) {
                  case 'Object':
                      return `{${Object.entries(argItem)
                        .map(([key, value]) => (`${key}:${formatArgumentForPrint(value)}`))}}`;
                  case 'Array':
                      return `[${argItem.map((item) => formatArgumentForPrint(item))}]`;
                  default:
                      return `-${constructorName}-`;
              }
          case 'string':
              return `'${argItem}'`;
          default:
              return `${argItem}`;
      }
  }
  function logTag(str, ...key) {
      let result = '';
      str.forEach((item, index) => {
          const keyItem = key[index];
          result += item + (keyItem ? formatArgumentForPrint(keyItem) : '');
      });
      return result;
  }
  function contentLengthFormat(content, contentLengthLimit, replaceString) {
      if (contentLengthLimit) {
          const maxContentLength = contentLengthLimit;
          const contentLength = content.length;
          if (contentLength <= maxContentLength) {
              return content;
          }
          const beforeSliceLength = Math.floor(maxContentLength / 2) + 1;
          const afterSliceLength = maxContentLength - beforeSliceLength;
          const ignoredTipString = util$1.isUndefined(replaceString) ? ` <<<... ${contentLength - maxContentLength} chars are ignored ...>>> ` : replaceString;
          return `${content.slice(0, beforeSliceLength)}${ignoredTipString}${content.slice(-afterSliceLength)}`;
      }
      return content;
  }
  function dateformat(date = Date.now(), formatStr = 'yyyy-mm-dd HH:MM:ss.l') {
      const tDate = (typeof date === 'number') ? new Date(date) : date;
      let result = formatStr;
      const o = {
          'y+': () => tDate.getFullYear(),
          'm+': () => (tDate.getMonth() + 1),
          'd+': () => tDate.getDate(),
          'H+': () => tDate.getHours(),
          'M+': () => tDate.getMinutes(),
          's+': () => tDate.getSeconds(),
          'l': () => tDate.getMilliseconds(),
      };
      for (let k in o) {
          if (new RegExp(`(${k})`).test(result)) {
              const v = o[k]();
              result = result.replace(RegExp.$1, ('' + v).padStart(RegExp.$1.length, '0'));
          }
      }
      return result;
  }

  class Appender {
      constructor(config = {}) {
          this.config = config;
      }
      getPrintContent(printFields) {
          const { format } = this.config;
          return format ? format(printFields) : printFields.logContent;
      }
  }

  const defaultAppenderConfig = {
      colorScheme: {
          DEBUG: ['#274e13', '#b6d7a8'],
          INFO: ['#073763', '#b6d7a8'],
          default: ['#000000', '#d3d3d3'],
      }
  };
  class ConsoleAppender extends Appender {
      constructor(config = {}) {
          super(config);
          this.config = {
              ...super.config,
              ...defaultAppenderConfig,
              ...config
          };
      }
      print(logField) {
          const content = this.getPrintContent(logField);
          const { level = null, } = logField;
          const defaultLevel = defaultConfig.level;
          const consoleLog = ({
              [defaultLevel.debug]: console.debug,
              [defaultLevel.info]: console.info,
              [defaultLevel.warn]: console.warn,
              [defaultLevel.error]: console.error,
              null: console.log,
          })[level];
          const { colorScheme } = this.config;
          if (!colorScheme || !isNode) {
              consoleLog(content);
          }
          else {
              const [fontColor, bgColor] = colorScheme[level] || colorScheme['default'];
              if (fontColor || bgColor) {
                  consoleLog(`%c${content}`, `${fontColor ? `color: ${fontColor}` : ''}${bgColor ? `background-color: ${bgColor};` : ''}`);
              }
              else {
                  consoleLog(content);
              }
          }
      }
  }

  const defaultAppenderConfig$1 = {
      filePath: './',
      fileName: `${dateformat(Date.now(), 'yyyy-mm-dd')}`,
      fileExtension: 'log',
      childConfigRule: null,
  };
  class ConsoleAppender$1 extends Appender {
      constructor(config = {}) {
          super(config);
          this.config = {
              ...super.config,
              ...defaultAppenderConfig$1,
              ...config
          };
          this.init();
      }
      init() {
          this.makeLogDir(this.config.filePath);
      }
      makeLogDir(dirName) {
          if (fs.existsSync(dirName)) {
              return true;
          }
          if (this.makeLogDir(path.dirname(dirName))) {
              console.log(`the log dir didn't exist and it is created: ${dirName}`);
              fs.mkdirSync(dirName);
              return true;
          }
          return false;
      }
      writeToFile(file, content) {
          return new Promise((resolve, reject) => {
              fs.appendFile(file, content, (err) => {
                  if (err) {
                      console.error(`print log file error: ${err}`);
                      reject(err);
                  }
                  else {
                      resolve();
                  }
              });
          });
      }
      print(logField) {
          const content = this.getPrintContent(logField);
          let isOnlyPrintChildLog = false;
          const { filePath, fileName, fileExtension, childConfigRule } = this.config;
          if (childConfigRule) {
              const childConfig = (typeof childConfigRule === 'function') ? childConfigRule(logField) : childConfigRule;
              const { filePath: childFilePath = filePath, fileName: childFileName = fileName, fileExtension: childFileExtension = fileExtension, only = false } = childConfig;
              this.writeToFile(`${childFilePath}/${childFileName}.${childFileExtension}`, content);
              isOnlyPrintChildLog = only;
          }
          if (!isOnlyPrintChildLog) {
              this.writeToFile(`${filePath}/${fileName}.${fileExtension}`, content);
          }
      }
  }

  class AppenderManager {
      constructor() {
          this.appenders = [];
      }
      set(appenders) {
          const legalAppenders = appenders.filter(item => item instanceof Appender);
          this.appenders = legalAppenders;
          return legalAppenders.length;
      }
      get() {
          return this.appenders;
      }
      register(appender) {
          if (appender instanceof Appender) {
              if (!this.appenders.includes(appender)) {
                  this.appenders.push(appender);
              }
          }
          else {
              throw new Error('the received appender seems not be extended from Appender');
          }
      }
      delete(appender) {
          const preLen = this.appenders.length;
          this.appenders = this.appenders.filter(item => item !== appender);
          return this.appenders.length !== preLen;
      }
  }

  // the log called count
  let count = 1;
  class Logger {
      constructor(logArgs = {}, config = {}) {
          this.Appender = new AppenderManager();
          this.args = deepMerge(defaultArguments, logArgs);
          this.config = deepMerge(defaultConfig, config);
          this.logWrap = this.logWrap.bind(this);
          this.logDecorator = this.logDecorator.bind(this);
          this.init();
      }
      init() {
          const levelConfig = this.config.level;
          Object.keys(levelConfig)
              .forEach((level) => {
              if (!this[level]) {
                  this[level] = function (content = '', args = {}) {
                      return this.log(content, { level: levelConfig[level], ...args });
                  };
              }
          });
          this.Appender.set([new ConsoleAppender()]);
      }
      print(printFields = {}) {
          this.Appender.appenders.forEach((appender) => {
              appender.print(printFields);
          });
      }
      log(content = '', logArgs = {}) {
          const logFields = {
              level: this.config.level.info,
              ...this.args,
              ...logArgs,
              timeStamp: Date.now(),
              count,
              content,
          };
          if (this.config.printLevel && this.config.printLevel.some(level => this.config.level[level] === logFields.level)) {
              try {
                  const logContent = this.config.format(logFields);
                  this.print({ ...logFields, logContent });
              }
              catch (err) {
                  console.error(`something wrong in log: ${err}`);
              }
              count += 1;
              return logFields;
          }
          return {};
      }
      debug(content = '', args = {}) {
          return this.log(content, { level: this.config.level.debug, ...args });
      }
      info(content = '', args = {}) {
          return this.log(content, { level: this.config.level.info, ...args });
      }
      warn(content = '', args = {}) {
          return this.log(content, { level: this.config.level.warn, ...args });
      }
      error(error, args = {}) {
          if (error instanceof Error) {
              const { name = '', message = '', stack = '' } = error;
              return this.log(stack, { level: this.config.level.error, errType: name, errDesc: message, ...args });
          }
          return this.log(error, { level: this.config.level.error, ...args });
      }
      logWrap(wrapped, logArgs = {}) {
          const _this = this;
          return function (...funArgs) {
              const funName = wrapped.name || '';
              _this.info(logTag `INPUT: ${funArgs}`, { category: _this.config.category.function, funName, ...logArgs });
              try {
                  const result = wrapped(...funArgs);
                  _this.info(logTag `OUTPUT: ${funArgs}`, { category: _this.config.category.function, funName, ...logArgs });
                  return result;
              }
              catch (err) {
                  _this.error(err, { category: _this.config.category.function, funName, ...logArgs });
              }
          };
      }
      logDecorator(logArgs = {}) {
          return (target, name, descriptor) => {
              const className = target.constructor.name;
              // const funName = name
              const wrapped = descriptor.value;
              if (wrapped) {
                  descriptor.value = this.logWrap(wrapped, { className, ...logArgs });
              }
              return descriptor;
          };
      }
  }

  const util = { logTag, contentLengthFormat, dateformat };
  const appender = { Appender, ConsoleAppender, FileAppender: ConsoleAppender$1 };

  exports.appender = appender;
  exports.default = Logger;
  exports.util = util;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
