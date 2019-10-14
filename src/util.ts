export function getRandomNumber(numDigit: number = 1): number {
  return Math.floor(Math.random() * (10 ** numDigit))
}

export function deepMerge(object1: object = {}, object2: object = {}): object {
  const result = { ...object1, ...object2 }
  Object.keys(object1).forEach((key) => {
    const value1 = object1[key]
    const value2 = object2[key]
    if (value1.constructor.name === 'Object' && value2 && value2.constructor.name === 'Object') {
      result[key] = deepMerge(value1, value2)
    }
  })
  return result
}

export const isNode = (typeof global === 'object')
