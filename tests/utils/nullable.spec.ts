import { expect, test, describe } from 'vitest'
import {
  isInvalidOrEmptyArray,
  isNullOrUndefined,
  isValidArrayWithMembers,
  isValidObject,
  isEmptyObject,
  or
} from '@src/utils/nullable.ts'

describe('nullable utilities', () => {
  describe('isNullOrUndefined', () => {
    test('should return true for null and undefined', () => {
      expect(isNullOrUndefined(null)).toBe(true)
      expect(isNullOrUndefined(undefined)).toBe(true)
    })

    test('should return true for empty string', () => {
      expect(isNullOrUndefined('')).toBe(true)
      expect(isNullOrUndefined('  ')).toBe(true)
    })

    test('should return false for non-null values', () => {
      expect(isNullOrUndefined(0)).toBe(false)
      expect(isNullOrUndefined(false)).toBe(false)
      expect(isNullOrUndefined('test')).toBe(false)
      expect(isNullOrUndefined({})).toBe(false)
      expect(isNullOrUndefined([])).toBe(false)
    })
  })

  describe('isValidObject', () => {
    test('should return true for objects', () => {
      expect(isValidObject({})).toBe(true)
      expect(isValidObject([])).toBe(true)
      expect(isValidObject(new Date())).toBe(true)
    })

    test('should return false for non-objects', () => {
      expect(isValidObject(null)).toBe(false)
      expect(isValidObject(undefined)).toBe(false)
      expect(isValidObject('test')).toBe(false)
      expect(isValidObject(123)).toBe(false)
      expect(isValidObject(true)).toBe(false)
    })
  })

  describe('isEmptyObject', () => {
    test('should return true for empty objects', () => {
      expect(isEmptyObject({})).toBe(true)
    })

    test('should return false for non-empty objects', () => {
      expect(isEmptyObject({ key: 'value' })).toBe(false)
      expect(isEmptyObject([1, 2, 3])).toBe(false)
    })

    test('should return false for non-objects', () => {
      expect(isEmptyObject(null)).toBe(false)
      expect(isEmptyObject(undefined)).toBe(false)
      expect(isEmptyObject('test')).toBe(false)
    })
  })

  describe('isInvalidOrEmptyArray', () => {
    test('should return true for null, undefined, and empty arrays', () => {
      expect(isInvalidOrEmptyArray(null)).toBe(true)
      expect(isInvalidOrEmptyArray(undefined)).toBe(true)
      expect(isInvalidOrEmptyArray([])).toBe(true)
    })

    test('should return false for non-empty arrays', () => {
      expect(isInvalidOrEmptyArray([1, 2, 3])).toBe(false)
      expect(isInvalidOrEmptyArray(['test'])).toBe(false)
    })

    test('should throw error for non-array values', () => {
      expect(() => isInvalidOrEmptyArray({} as any)).toThrow('isInvalidOrEmptyArray expects an array')
    })
  })

  describe('isValidArrayWithMembers', () => {
    test('should return true for non-empty arrays', () => {
      expect(isValidArrayWithMembers([1, 2, 3])).toBe(true)
      expect(isValidArrayWithMembers(['test'])).toBe(true)
    })

    test('should return false for null, undefined, and empty arrays', () => {
      expect(isValidArrayWithMembers(null)).toBe(false)
      expect(isValidArrayWithMembers(undefined)).toBe(false)
      expect(isValidArrayWithMembers([])).toBe(false)
    })
  })

  describe('or', () => {
    test('should return fallback value for null or undefined', () => {
      expect(or(null, 'fallback')).toBe('fallback')
      expect(or(undefined, 'fallback')).toBe('fallback')
      expect(or('', 'fallback')).toBe('fallback')
    })

    test('should return original value if not null or undefined', () => {
      expect(or('test', 'fallback')).toBe('test')
      expect(or(0, 1)).toBe(0)
      expect(or(false, true)).toBe(false)
    })
  })
})
