# jLogger
A tiny & flexible logger for JS

[toc]



## Install

```javascript
npm install -S @8pattern/jlogger
```



## Usage

### Demo with default appenders

```javascript
import JLogger from '@8pattern/jlogger'
const logger = new JLogger()
logger.info('hello, world')
```

if you execute the previous codes, you will find the console prints a JSON like *{"level":"INFO", ... ,"count":1,"content":"hello, world"}* automatically. 

### Demo with appenders

```javascript
import JLogger, { appender } from '@8pattern/jlogger'
const logger = new JLogger()
logger.Appender.register(new appender.FileAppender())
logger.info('hello, world')
```

Execute the previous codes, not only the console will print a JSON like *{"level":"INFO", ... ,"count":1,"content":"hello, world"}*, but also a log file (yyyy-mm-dd.log) can be found in same dir with the same JSON (in Node environment). 

### Procedure

#### Preparation

Before print logs by jLogger, a instance should be generated. It allows users to bind some arguments and configurations on the instance. The construction function can receive two arguments.

```javascript
const logArguments = {}, logConfig = {}
const logger = new JLogger(logArguments, logConfig)
```

1. logArguments &lt;object&gt;: receive some default arguments within this instance scope, i.e., each log will receive these arguments.

   In Node environment, the default value is:

   + **pid**: same as process.pid

   In browser, the default value are:

   + **wid**: a random number less than 100,000
   + **url**: the current route path, i.e., the href without protocol, host and port

   **You CAN assign some custom arguments**, such as: filePath, author and etc.

   ```javascript
   const logArguments = { hello: 'world' }
   const logger = new JLogger(logArguments)
   logger.info('') // { ..., hello: 'world', ... }
   ```

2. logConfig &lt;object&gt;: some configurations to change the logger behavior.

   Only the following configurations is valid.

   + **category**  &lt;JSON&gt;

     Default value: 

     ```json
     {
         notice: 'NOTICE',
         action: 'ACTION',
         function: 'FUNCTION',
     }
     ```

   > **NOTE**: you can change these category values or add some new categories. **Deletion is useless** (Because we use them inside).

   

   + **level** &lt;JSON&gt;
   
     Default value: 
   
     ```javascript
     {
         error: 'ERROR',
         warn: 'WARN',
         info: 'INFO',
         debug: 'DEBUG',
     }
     ```
   
   > **NOTE**: Same as category, change values and add new levels works but **Deletion is useless**.

   + format &lt;function&gt;
   
     + argument: logArguments &lt;JSON&gt;
     + return: logString &lt;string&gt;
   
     Default value: 
   
     ```javascript
     (logArgs) => JSON.stringify(logArgs)
     ```
   
   > 1. The content of logArguments will be presented at the following section.
   > 2. If some log arguments don't wanted to be printed, such as some levels or categories, you can modify this format implementation.
   
   + printLevel &lt;array&gt;
   
     Default value: 
     
     ```javascript
     ['debug', 'info', 'warn', 'error']
     ```
   
   > The elements must be the keys rather than values in *logConfig.level*

#### Control appenders

##### Pre-given appenders

Appenders illustrates the print methods of  every logs. You can find some pre-given appenders from *appender* of the jLogger.

```javascript
import { appender } from '@8pattern/jlogger'
const { Appender, ConsoleAppender, FileAppender } = appender
```

+ **Appender**

  Abstract class for every specific appender. Only a abstract method *print* is binded on it. When you design a custom appender, you **MUST** extend from this parent class (presented later).

+ **ConsoleAppender**

  Print the logs into the console. It's also the default appenders, so you won't do anything but work.

+ **FileAppender**

  Print the logs into the file (only works in Node).

  ```javascript
  import JLogger, { appender } from '@8pattern/jlogger'
  const logger = new JLogger()
  logger.Appender.set([new appender.FileAppender()])
  ```

  It can be instantiated with some configurations as well.

  ```javascript
  const fileAppender = new FileAppender({
      filePath: './',
      fileName: `${dateformat(Date.now(), 'yyyy-mm-dd')}`,
      fileExtension: 'log',
  })
  ```

  + filePath &lt;string&gt;: the revelant path of the log file. 

    Default value: *'./'*

  + fileName &lt;string&gt;: the name of the log file. 

    Default value: `${dateformat(Date.now(), 'yyyy-mm-dd')}`

  + fileExtension &lt;string&gt;: the extension of the log file. 

    Default value: `log`

##### Update appenders

To activate an appender, you need process the *logger.Appender*, and it provides some methods to control registered appenders.

+ appenders &lt;array&gt;: store the registered appenders.

  ```javascript
  const logger = new JLogger()
  console.log(logger.Appenders.appenders.length)
  // 1, there is a instance of ConsoleAppender by default
  ```

+ set &lt;function&gt;

  + argument: appenders &lt;array&gt;

  + return: currentRegisteredAppendersNumber &lt;number&gt;

  ```javascript
  logger.Appenders.set([new ConsoleAppender(), new FileAppender()])
  ```
  > NOTE:
  >
  > 1. This method will replace all appenders.
  > 2. Any appenders which not extended from the abstract class Appender will be filtered. 

+ get &lt;function&gt;

  + argument: null

  + return: appenders&lt;array&gt;

  ```javascript
  logger.Appender.get() // === logger.Appender.appenders
  ```

+ register &lt;function&gt;

  + argument: appender
  + return: null

    ```javascript
  logger.Appender.register(new FileAppender()) // logger.Appender.appenders.length === 2
    ```

  > NOTE:
  >
  > 1. Compare to set method, it only add a new appender RATHER THAN replace all of them.
  > 2. ONLY instance of abstract class Appender will make effect as well.
  > 3. If the appender has been registered, it won't add a new one.

  ```javascript
  logger.set([new ConsoleAppender()])
  // logger.Appenders.appenders.length === 1
  
  const fileAppender = new FileAppender()
  
  logger.Appender.register(fileAppender)
  // logger.Appenders.appenders.length === 2, register a new FileAppender instance
  
  logger.Appender.register(fileAppender)
  // logger.Appenders.appenders.length === 2, because it has been registered before
  
  logger.Appender.register(new FileAppender())
  // logger.Appenders.appenders.length === 3, a new FileAppender registered
  
  logger.Appender.register({})
  // throw a error, because the provided appender is illegal.
  ```

  

+ delete &lt;function&gt;

  + argument: appender

  + return: isSuccess &lt;boolean&gt;

  ```javascript
  const fileAppender = new FileAppender()
  
  logger.Appender.set([fileAppender])
  // logger.Appenders.appenders.length === 1
  
  logger.Appender.delete(new FileAppender())
  // === false, logger.Appenders.appenders.length === 1, the given appender doesen't exist
  
  const fileAppender = new FileAppender()
  
  logger.Appender.delete(fileAppender)
  // === true, logger.Appenders.appenders.length === 0
  ```

##### Design a custom appender

If you want to customize a appender, you only need to extend your class from Appender and implement the print method.

```javascript
import { appender } from '@8pattern/jlogger'

class CustomAppender extends appender.Appender {
    print(logArgs) {
        console.log(logArgs)
    }
}

jlogger.Appender.register(new CustomAppender())
```



#### Call to log

##### logArgument

The logArgument contains all fields of a log, and it may be used to format the logger or print in the appender. It must contains the following values.

+ **level**: the log level. Default value: *logger.config.level.info*.
+ **timeStamp**: current time stamp (without formation). Value: *Date.now()*.
+ **count**: the number of log called. Value: automatically increased from 0.
+ **content**: the log content.

Besides, some custom arguments can be added from construction or log call function. And the arguments from call function has higher priority than the construction. But, **"*timeStamp*" and "*count*" have the higher priority and can't be overridden.**

```javascript
const logger = new Logger({a: 1, b: 2})
logger.info('', { b: 3, c: 4 })
// { ..., a: 1, b: 3, c: 4, ... }
```



> If you want change the time or count in final logs, add another arguments and change the format function.

##### Ordinary log method

+ **log**

  + argument: content &lt;string&gt;, logArgs &lt;JSON&gt;
  + return: finalLogArgs &lt;JSON&gt;

  ```javascript
  logger.log('hello world', { a: 1 })
  // { a: 1, ... content: 'hello world', ... }
  ```

+ **debug** / **info** / **warn**

  + argument: content &lt;string&gt;, logArgs &lt;JSON&gt;
  + return: finalLogArgs &lt;JSON&gt;

  They are all sugar of log with levels.

  ```javascript
  logger.debug('') // { ..., level: 'DEBUG', ... }
  logger.info('') // { ..., level: 'INFO', ... }
  logger.warn('') // { ..., level: 'WARN', ... }
  ```

+ **error**

  + argument: content &lt;string&gt; | &lt;Error&gt;, logArgs &lt;JSON&gt;
  + return: finalLogArgs &lt;JSON&gt;

  It is also the sugar of log with error level, but it can receive Error as content. If called with an Error, "*errType*" and "*errDesc*" will be added into finalLogArgs, and the stack of Error will be regarded as the content

  ```javascript
  logger.error('')
  // { ..., content: '', ..., level: 'ERROR', ... }
  
  const err = new Error('Some errors')
  logger.error(err)
  // { ..., content: 'Error: Some errors at ...', ..., errDesc: 'Some errors', errType: 'Error', ... }
  ```

+ other level defined in config

  If some other levels defined in config, it provides these sugars as well.

  ```javascript
  const level = {
      fatal: 'FATAL',
  }
  const logger = new JLogger({}, { level })
  logger.fatal('')
  // { ..., level: 'FATAL', ... }
  ```

##### Function log

Since function logs are so important but their same structures bored the coder, we provide two methods for function logs particularly.

+ logWrap

  + argument: wrapped &lt;Function&gt;, logArgs &lt;JSON&gt;
  + return: &lt;Function&gt;

  This method will print logs of the wrapped function input and output. If the function throws an error, it will print a error log automatically.

  ```javascript
  const fun(a) {
      return a + 1;
  }
  
  const wrappedFun = jLogger.logWrap(fun, { t: 1 })
  
  wrappedFun(1)
  // { ..., content: 'INPUT: [1]',category: 'FUNCTION', funName: 'fun', t: 1, ...}
  // { ..., content: 'OUTPUT: 2',category: 'FUNCTION', funName: 'fun', t: 1, ...}
  ```
  
    ```javascript
  const fun() {
      throw new Error('some errors')
  }
  
  const wrappedFun = jLogger.logWrap(fun)
  
  wrappedFun('hello')
  // { ..., content: 'INPUT: ['hello']', category: 'FUNCTION', funName: 'fun', ...}
  // { ..., category: 'FUNCTION', funName: 'fun', level: 'ERROR', ...}
    ```

+ logDecorator

  + argument: logArgs &lt;JSON&gt;
  + return: &lt;Function&gt;

  There is a proposal for decorator for class method，and we also provide a logDecorator which is based on logWrap.

  ```javascript
  const log = logger.logDecorator({ test: 1 })
  
  class T {
      @log
      test1(a) {
          return a + 1
      }
      
      @logger.logDecorator({ test: 2 })
      test2() {
          throw new Error('some errors')
      }
  }
  
  const t = T()
  
  t.test1(1)
  // { ..., content: 'INPUT: [1]', category: 'FUNCTION', className: 'T', funName: 'test1', t: 1, ...}
  // { ..., content: 'OUTPUT: 2',category: 'FUNCTION', className: 'T', funName: 'test1', t: 1, ...}
  
  t.test(2)
  // { ..., content: 'INPUT: [2]', category: 'FUNCTION', className: 'T', funName: 'test2', t: 2, ...}
  // { ..., category: 'FUNCTION', level: 'ERROR', className: 'T', funName: 'test2', t: 2, ...}
  ```

  

### Util

We provide some useful tools relevant to logs, which can be found from *jLogger.util* 

```javascript
import { util } from '@8pattern/jlogger'
const { dateformat, contentLengthFormat, logTag } = util
```

#### dateformat

+ argument:
  + date &lt;Date&gt; | &lt;number&gt;. Default value: *new Date()*
  + formatStr &lt;string&gt;. Default value: 'yyyy-mm-dd HH:MM:ss.l'
+ return: &lt;string&gt;

This method is a tiny function to format date. The usage is similar with the other mature library， i.e.,

```javascript
y -> year
m -> month
d -> day
H -> hour
M -> minute
s -> second
l -> millisecond
```

For example:

```javascript
dateformat(0, 'yyyy-mm-dd') // 1970-01-01
dateformat(new Date(0), 'yy-m-d') // 70-1-1
dateformat(0, 'HH:MM:ss') // 00:00:00
dateformat(0, 'H:M:s.l') // 0:0:0.0000
```

#### contentLengthFormat

+ argument:
  + content &lt;string&gt;.
  + lengthLimit &lt;number&gt; | &lt;null&gt;. Default value: null
  + replaceString &lt;string&gt;. Default value: ' <<<... $IGNORED_STRING_LENGTH chars are ignored ...>>> '
+ return: &lt;string&gt;

```javascript
contentLengthFormat('123456789')
// 123456789, because lengthLimit === null

contentLengthFormat('123456789', 4)
// 12 <<<... 5 chars are ignored ...>>> 89

contentLengthFormat('123456789', 4, '...igonred...')
// 12...ignored...89
```

#### logTag

The tag for the template string for a log content. It will transform Function, Array and Object into more readable formation.

```javascript
function fun(a) { return a + 1; }
`${fun}` // "function fun(a) { return a + 1; }"
logTag`${fun}` // "-Function[fun]-"
```

```javascript
const arr = [1,2,3,4,5]
`${arr}` // "1,2,3,4,5"
logTag`${fun}` // "[1,2,3,4,5]"
```

```javascript
const dict = { a: 1 }
`${dict}` // "[object Object]"
logTag`${dict}` // "{ a: 1 }"
```

```javascript
class CustomClass {}
const t = new CustomClass()
`${t}` // "[object Object]"
logTag`${t}` // "-CustomClass-"
```

A complete example:

```javascript
const obj = {
    arr: [1, 2, function() {}],
    fun() {},
}

`content is ${obj}` // "content is [object Object]"
logTag`content is ${obj}` // "content is {arr:[1,2,-Function-], fun:-Function[fun]-}"
```

