import {
  getRandomNumber,
  deepMerge,
} from '../src/util'

describe('util: getRandomNumber', () => {
  test('able to get the assigned digit', () => {
    for(let i = 0; i <= 100; i += 1) {
      const digit = Math.round(Math.random() * 1000)
      const result = getRandomNumber(digit)
      expect(result).toBeLessThanOrEqual(10 ** digit)
    }
  })

  test('default return can not be grater than 10', () => {
    for(let i = 0; i <= 100; i += 1) {
      const result = getRandomNumber()
      expect(result).not.toBeGreaterThan(10)
    }
  })
})

describe('util: deepMerge', () => {
  test('basic value', () => {
    const o1 = {
      a: 1,
      b: false,
    }
    const o2 = {
      a: 3,
      c: 'test',
    }
    expect(deepMerge(o1, o2)).toEqual({
      a: 3,
      b: false,
      c: 'test',
    })
  })

  test('array and function', () => {
    const handle = () => {}
    const o1 = {
      a: [1, 2, 3],
      b: () => {console.log(1)},
    }
    const o2 = {
      a: [4, 5, 6],
      b: handle,
    }
    expect(deepMerge(o1, o2)).toEqual({
      a: [4, 5, 6],
      b: handle,
    })
  })

  test('object', () => {
    const o1 = {
      a: {
        b: 1,
        c: 2,
        d: 3,
        z: {
          x: 1,
          y: 2,
        }
      },
    }
    const o2 = {
      a: {
        b: 4,
        c: 5,
        e: 6,
        z: {
          x: 3,
        }
      },
    }
    expect(deepMerge(o1, o2)).toEqual({
      a: {
        b: 4,
        c: 5,
        d: 3,
        e: 6,
        z: {
          x: 3,
          y: 2,
        }
      },
    })
  })

  test('object - not object', () => {
    const o1 = {
      a: {
        b: 1,
        c: 2,
        d: 3
      },
    }

    expect(deepMerge(o1, {
      a: 1,
    })).toEqual({
      a: 1,
    })

    expect(deepMerge(o1, {
      a: [1, 2, 3],
    })).toEqual({
      a: [1, 2, 3],
    })
  })

  test('not object - object', () => {
    const o2 = {
      a: {
        b: 1,
        c: 2,
        d: 3
      },
    }

    expect(deepMerge({
      a: 1,
    }, o2)).toEqual(o2)

    expect(deepMerge({
      a: [1, 2, 3],
    }, o2)).toEqual(o2)
  })
})