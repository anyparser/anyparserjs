import { expect, test, describe } from 'vitest'
import { buildOptions, validateApiKey } from '@src/options.ts'

describe('options', () => {
  describe('validateApiKey', () => {
    test('should throw error for missing API key', () => {
      expect(() => validateApiKey(undefined)).toThrow('API key is required')
    })

    test('should throw error for empty API key', () => {
      expect(() => validateApiKey('')).toThrow('API key is required')
    })

    test('should throw error for whitespace-only API key', () => {
      expect(() => validateApiKey('   ')).toThrow('API key must be a non-empty string')
    })

    test('should not throw for valid API key', () => {
      expect(() => validateApiKey('valid-key')).not.toThrow()
    })

    test('should throw error for non-string API key', () => {
      expect(() => validateApiKey(123 as any)).toThrow('API key must be a non-empty string')
    })
  })

  describe('buildOptions', () => {
    test('should merge defaults with provided options', () => {
      const options = buildOptions({
        apiKey: 'test-key',
        apiUrl: new URL('https://api.example.com'),
        format: 'markdown'
      })

      expect(options).toMatchObject({
        apiKey: 'test-key',
        format: 'markdown',
        model: 'text',
        encoding: 'utf-8'
      })
    })

    test('should handle all optional fields', () => {
      const options = buildOptions({
        apiKey: 'test-key',
        apiUrl: new URL('https://api.example.com'),
        format: 'json',
        model: 'ocr',
        encoding: 'utf-8',
        image: true,
        table: true,
        ocrLanguage: ['eng'],
        ocrPreset: 'document',
        url: 'https://example.com',
        maxDepth: 3,
        maxExecutions: 100,
        strategy: 'FIFO',
        traversalScope: 'domain'
      })

      expect(options).toMatchObject({
        apiKey: 'test-key',
        format: 'json',
        model: 'ocr',
        encoding: 'utf-8',
        image: true,
        table: true,
        ocrLanguage: ['eng'],
        ocrPreset: 'document',
        url: 'https://example.com',
        maxDepth: 3,
        maxExecutions: 100,
        strategy: 'FIFO',
        traversalScope: 'domain'
      })
    })

    test('should handle undefined options', () => {
      const options = buildOptions({
        apiKey: 'test-key',
        apiUrl: new URL('https://api.example.com')
      })

      expect(options).toMatchObject({
        apiKey: 'test-key',
        format: 'json',
        model: 'text',
        encoding: 'utf-8'
      })

      expect(options.image).toBe(true)
      expect(options.table).toBe(true)
      expect(options.ocrLanguage).toBeUndefined()
      expect(options.ocrPreset).toBeUndefined()
      expect(options.url).toBeUndefined()
      expect(options.maxDepth).toBeUndefined()
      expect(options.maxExecutions).toBeUndefined()
      expect(options.strategy).toBeUndefined()
      expect(options.traversalScope).toBeUndefined()
    })

    test('should throw error for missing API URL', () => {
      expect(() => buildOptions({
        apiKey: 'test-key',
        apiUrl: undefined
      })).toThrow('API URL is required')
    })

    test('should handle undefined options', () => {
      expect(() => buildOptions(undefined)).toThrow('API key is required')
    })

    test('should handle missing apiKey in merged options', () => {
      const options = {
        apiUrl: new URL('https://api.example.com')
      }
      expect(() => buildOptions(options)).toThrow('API key is required')
    })

    test('should handle empty apiKey in merged options', () => {
      const options = {
        apiKey: '',
        apiUrl: new URL('https://api.example.com')
      }
      expect(() => buildOptions(options)).toThrow('API key is required')
    })

    test('should handle null values in options', () => {
      const options = buildOptions({
        apiKey: 'test-key',
        apiUrl: new URL('https://api.example.com'),
        format: null as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        model: null as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        encoding: null as any // eslint-disable-line @typescript-eslint/no-explicit-any
      })

      expect(options).toMatchObject({
        format: 'json',
        model: 'text',
        encoding: 'utf-8'
      })
    })

    test('should handle non-URL apiUrl', () => {
      expect(() => buildOptions({
        apiKey: 'test-key',
        apiUrl: undefined
      })).toThrow('API URL is required')
    })
  })
})
