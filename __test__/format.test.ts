import {
  formatArgumentForPrint,
  logTag,
  contentLengthFormat,
  dateformat,
} from '../src/format'

describe('format: formatArgumentForPrint', () => {
  test('number', () => {
    expect(formatArgumentForPrint(1)).toBe('1')
    expect(formatArgumentForPrint(1.2)).toBe('1.2')
    expect(formatArgumentForPrint(-1.23)).toBe('-1.23')
    expect(formatArgumentForPrint(NaN)).toBe('NaN')
  })

  test('string', () => {
    expect(formatArgumentForPrint('hello')).toBe("'hello'")
  })

  test('boolean', () => {
    expect(formatArgumentForPrint(true)).toBe('true')
    expect(formatArgumentForPrint(false)).toBe('false')
  })

  test('undefined & null', () => {
    expect(formatArgumentForPrint(undefined)).toBe('undefined')
    expect(formatArgumentForPrint(null)).toBe('null')
  })

  test('function', () => {
    expect(formatArgumentForPrint(() => {})).toBe('-Function-')

    function test1() {}
    expect(formatArgumentForPrint(test1)).toBe('-Function[test1]-')

    const test2 = () => {}
    expect(formatArgumentForPrint(test2)).toBe('-Function[test2]-')

    const test3 = function() {}
    expect(formatArgumentForPrint(test3)).toBe('-Function[test3]-')

    const test4 = function test5() {}
    expect(formatArgumentForPrint(test4)).toBe('-Function[test5]-')
  })

  test('array', () => {
    expect(formatArgumentForPrint([1, true, 'hello', null])).toBe("[1,true,'hello',null]")
    expect(formatArgumentForPrint([
      [1, 2],
      function test() {},
      undefined,
    ])).toBe('[[1,2],-Function[test]-,undefined]')
  })

  test('object', () => {
    expect(formatArgumentForPrint({
      a: 1,
      b: 2,
    })).toBe('{a:1,b:2}')

    expect(formatArgumentForPrint({
      a() {},
      b: function test() {},
    })).toBe('{a:-Function[a]-,b:-Function[test]-}')

    expect(formatArgumentForPrint({
      z: {
        a: [1, 2, 3],
        b: function() {},
      },
      c: true,
    })).toBe('{z:{a:[1,2,3],b:-Function[b]-},c:true}')
  })
})

describe('format: logTag', () => {
  test('oridinary string', () => {
    expect(logTag`hello world`).toBe('hello world')
  })

  test('string with unformated variable', () => {
    const fun = () => {}
    const dict = { a: [1,2,3,4], b: null, c(){} }
    expect(logTag`fun: ${fun}; dict: ${dict}`).toBe('fun: -Function[fun]-; dict: {a:[1,2,3,4],b:null,c:-Function[c]-}')
  })
})

describe('format: contentLengthFormat', () => {
  test('without length limit', () => {
    const logContent = 'This is a test'
    expect(contentLengthFormat(logContent)).toBe(logContent)
  })

  test('with length limit', () => {
    const logContent = 'This is a test'
    expect(contentLengthFormat(logContent, 100)).toBe(logContent)
    expect(contentLengthFormat(logContent, 100, 'testtesttest')).toBe(logContent)
    expect(contentLengthFormat(logContent, 5, '').length).toBe(5)
    expect(contentLengthFormat(logContent, 8, '').length).toBe(8)
  })

  test('placehold', () => {
    const logContent = 'This is a test'
    expect(contentLengthFormat(logContent, 100)).toBe(logContent)
    expect(contentLengthFormat(logContent, 5)).toMatch(/<<<... 9 chars are ignored ...>>>/)
    expect(contentLengthFormat(logContent, 5, 'log placeholder')).toMatch(/log placeholder/)
  })
})

describe('format: dateformat', () => {
  test('date argument', () => {
    expect(dateformat(0)).toBe('1970-01-01 08:00:00.0')
    expect(dateformat(new Date(0))).toBe('1970-01-01 08:00:00.0')
  })

  test('format argument', () => {
    expect(dateformat(0, 'y')).toBe('1970')
    expect(dateformat(0, 'yy')).toBe('1970')
    expect(dateformat(0, 'yyy')).toBe('1970')
    expect(dateformat(0, 'yyyy')).toBe('1970')

    expect(dateformat(0, 'm')).toBe('1')
    expect(dateformat(0, 'mm')).toBe('01')
    expect(dateformat(0, 'mmm')).toBe('001')

    expect(dateformat(0, 'd')).toBe('1')
    expect(dateformat(0, 'dd')).toBe('01')
    expect(dateformat(0, 'ddd')).toBe('001')

    expect(dateformat(0, 'H')).toBe('8')
    expect(dateformat(0, 'HH')).toBe('08')
    expect(dateformat(0, 'HHH')).toBe('008')

    expect(dateformat(0, 'M')).toBe('0')
    expect(dateformat(0, 'MM')).toBe('00')
    expect(dateformat(0, 'MMM')).toBe('000')

    expect(dateformat(0, 's')).toBe('0')
    expect(dateformat(0, 'ss')).toBe('00')
    expect(dateformat(0, 'sss')).toBe('000')

    expect(dateformat(0, 'l')).toBe('0')

    expect(dateformat(0, 'yyyy-mm-dd')).toBe('1970-01-01')
    expect(dateformat(0, 'dd.mm.yyyy')).toBe('01.01.1970')
    expect(dateformat(0, 'HH:MM:ss')).toBe('08:00:00')
    expect(dateformat(0, 'ss.l')).toBe('00.0')
  })
})
