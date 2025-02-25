/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { expect, test, describe } from 'vitest'
import { transformToCamel } from '@src/utils/camel-case.ts'

interface StringOrRecordObject {
  [key: string]: StringOrRecord
}

type StringOrRecord = string | StringOrRecordObject

describe('transformToCamel', () => {
  test('should handle primitive values', () => {
    expect(transformToCamel(123)).toBe(123)
    expect(transformToCamel('test')).toBe('test')
    expect(transformToCamel(true)).toBe(true)
    expect(transformToCamel(null)).toBe(null)
    expect(transformToCamel(undefined)).toBe(undefined)
  })

  test('should handle Date objects', () => {
    const date = new Date()
    expect(transformToCamel(date)).toBe(date)
  })

  test('should handle RegExp objects', () => {
    const regex = /test/
    expect(transformToCamel(regex)).toBe(regex)
  })

  test('should handle URL objects', () => {
    const url = new URL('https://example.com')
    expect(transformToCamel(url)).toBe(url)
  })

  test('should handle functions', () => {
    const fn = () => {} // eslint-disable-line @typescript-eslint/no-empty-function

    expect(transformToCamel(fn)).toBe(fn)
  })

  test('should transform array elements', () => {
    const input = [{ test_key: 'value' }, { another_key: 'value' }]
    const expected = [{ testKey: 'value' }, { anotherKey: 'value' }]
    expect(transformToCamel(input)).toEqual(expected)
  })

  test('should transform Map keys and values', () => {
    const input = new Map<string, StringOrRecord>([
      ['test_key', { nested_key: 'value' }],
      ['another_key', 'value']
    ])

    const transformed = transformToCamel<Map<string, StringOrRecord>>(input)
    expect(transformed instanceof Map).toBe(true)

    expect(transformed.get('test_key')).toEqual({ nestedKey: 'value' })
    expect(transformed.get('another_key')).toBe('value')
  })

  test('should transform Set values', () => {
    const input = new Set<StringOrRecord>([{ test_key: 'value' }, { another_key: 'value' }])
    const transformed = transformToCamel<Set<StringOrRecord>>(input)
    expect(transformed instanceof Set).toBe(true)
    const values = Array.from(transformed)
    expect(values).toEqual([{ testKey: 'value' }, { anotherKey: 'value' }])
  })

  test('should transform nested objects', () => {
    const input = {
      test_key: {
        nested_key: {
          deep_key: 'value'
        },
        array_key: [{ array_item_key: 'value' }]
      }
    }
    const expected = {
      testKey: {
        nestedKey: {
          deepKey: 'value'
        },
        arrayKey: [{ arrayItemKey: 'value' }]
      }
    }
    expect(transformToCamel(input)).toEqual(expected)
  })
})
