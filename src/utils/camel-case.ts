import { underscoreToCamel } from './casing.ts'
import { isValidObject } from './nullable.ts'

export const transformToCamel = <T>(item: unknown): T => {
  if (item instanceof Date || item instanceof RegExp || item instanceof URL) {
    return item as T
  }

  // If the item is a Function, return it as-is
  if (typeof item === 'function') {
    return item as T
  }

  // If the item is null or undefined, return it as-is
  if (item === null || item === undefined) {
    return item as T
  }

  // If the item is an array, recursively transform each element
  if (Array.isArray(item)) {
    return item.map(el => transformToCamel(el)) as unknown as T
  }

  // If the item is a Map or Set, do not modify its structure
  if (item instanceof Map) {
    const transformedMap = new Map()
    item.forEach((value, key) => {
      transformedMap.set(transformToCamel(key), transformToCamel(value))
    })

    return transformedMap as unknown as T
  }

  if (item instanceof Set) {
    const transformedSet = new Set()
    item.forEach((value) => {
      transformedSet.add(transformToCamel(value))
    })

    return transformedSet as unknown as T
  }

  // If the item is a plain object, recursively transform its keys to camelCase
  if (isValidObject(item)) {
    return Object.keys(item).reduce((acc: any, key: string) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      const camelKey = underscoreToCamel(key)
      acc[camelKey] = transformToCamel((item as Record<string, unknown>)[key])

      return acc
    }, {} as T)
  }

  // If it's a primitive type (string, number, boolean), return it as-is
  return item as T
}
