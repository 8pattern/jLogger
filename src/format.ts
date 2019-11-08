import { isNullOrUndefined, isUndefined } from 'util'

export function formatArgumentForPrint(argItem: any): string {
  if (isNullOrUndefined(argItem)) {
    return `${argItem}`
  }

  switch (typeof argItem) {
    case 'function':
      const functionName = argItem.name
      return functionName ? `-Function[${functionName}]-` : '-Function-'
    case 'object':
      const constructorName = argItem.constructor.name
      switch (constructorName){
        case 'Object':
          return `{${
            Object.entries(argItem)
              .map(([key, value]) => (
                `${key}:${formatArgumentForPrint(value)}`
              ))
          }}`
        case 'Array':
          return `[${argItem.map((item: unknown) => formatArgumentForPrint(item))}]`
        default:
          return `-${constructorName}-`
      }
    case 'string':
      return `'${argItem}'`
    default:
      return `${argItem}`
  }
}

export function logTag(str: TemplateStringsArray, ...key: unknown[]): string {
  let result = ''
  str.forEach((item, index) => {
    const keyItem = key[index]
    result += item + (keyItem ? formatArgumentForPrint(keyItem) : '')
  })
  return result
}

export function contentLengthFormat(
  content: string,
  contentLengthLimit: number | null = null,
  replaceString?: string
): string {
  if (contentLengthLimit !== null) {
    const maxContentLength = contentLengthLimit
    const contentLength = content.length
    if (contentLength <= maxContentLength) {
      return content
    }
    const beforeSliceLength = Math.floor(maxContentLength / 2) + 1
    const afterSliceLength = maxContentLength - beforeSliceLength
    const ignoredTipString = isUndefined(replaceString) ? ` <<<... ${contentLength - maxContentLength} chars are ignored ...>>> ` : replaceString
    return `${content.slice(0, beforeSliceLength)}${ignoredTipString}${content.slice(-afterSliceLength)}`
  }
  return content
}

export function dateformat(date: Date | number = new Date(), formatStr: string = 'yyyy-mm-dd HH:MM:ss.l'): string {
  const tDate = (typeof date === 'number') ? new Date(date) : date
  let result = formatStr
  const o = {
    'y+': () => tDate.getFullYear(),
    'm+': () => (tDate.getMonth() + 1), 
    'd+': () => tDate.getDate(),
    'H+': () => tDate.getHours(),
    'M+': () => tDate.getMinutes(),
    's+': () => tDate.getSeconds(),
    'l': () => tDate.getMilliseconds(),
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(result)) {
      const v = o[k]()
      result = result.replace(RegExp.$1, ('' + v).padStart(RegExp.$1.length, '0'))
    }
  }
  return result
}