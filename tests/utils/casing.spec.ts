import { expect, test, describe } from 'vitest'
import {
  toUnderscore,
  hyphenToCamel,
  underscoreToCamel,
  camelToTitle
} from '@src/utils/casing.ts'

describe('casing utilities', () => {
  describe('toUnderscore', () => {
    test('should convert camelCase to underscore', () => {
      expect(toUnderscore('camelCase')).toBe('camel_case')
      expect(toUnderscore('thisIsATest')).toBe('this_is_a_test')
    })

    test('should handle empty or undefined input', () => {
      expect(toUnderscore()).toBe('')
      expect(toUnderscore('')).toBe('')
    })

    test('should handle already underscored input', () => {
      expect(toUnderscore('already_underscored')).toBe('already_underscored')
    })

    test('should handle mixed case with numbers', () => {
      expect(toUnderscore('mixedCase123Test')).toBe('mixed_case123_test')
    })
  })

  describe('hyphenToCamel', () => {
    test('should convert hyphenated to camelCase', () => {
      expect(hyphenToCamel('hyphen-case')).toBe('hyphenCase')
      expect(hyphenToCamel('this-is-a-test')).toBe('thisIsATest')
    })

    test('should handle string without hyphens', () => {
      expect(hyphenToCamel('nohyphens')).toBe('nohyphens')
    })

    test('should handle multiple consecutive hyphens', () => {
      expect(hyphenToCamel('multiple--hyphens')).toBe('multipleHyphens')
    })
  })

  describe('underscoreToCamel', () => {
    test('should convert underscore to camelCase', () => {
      expect(underscoreToCamel('underscore_case')).toBe('underscoreCase')
      expect(underscoreToCamel('this_is_a_test')).toBe('thisIsATest')
    })

    test('should handle string without underscores', () => {
      expect(underscoreToCamel('nounderscores')).toBe('nounderscores')
    })

    test('should handle multiple consecutive underscores', () => {
      expect(underscoreToCamel('multiple__underscores')).toBe('multipleUnderscores')
    })
  })

  describe('camelToTitle', () => {
    test('should convert camelCase to title case', () => {
      expect(camelToTitle('camelCase')).toBe('CamelCase')
      expect(camelToTitle('thisIsATest')).toBe('ThisIsATest')
    })

    test('should handle single word', () => {
      expect(camelToTitle('word')).toBe('Word')
    })

    test('should handle acronyms', () => {
      expect(camelToTitle('convertPDFToHTML')).toBe('ConvertPDFToHTML')
    })

    test('should handle empty string', () => {
      expect(camelToTitle('')).toBe('')
    })
  })
})
