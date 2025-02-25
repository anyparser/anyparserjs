import { expect, test, describe, beforeEach } from 'vitest'
import { env, envOr } from '@src/utils/env.ts'

describe('env utilities', () => {
  const originalEnv = process.env

  beforeEach(() => {
    // Reset process.env before each test
    process.env = { ...originalEnv }
  })

  describe('env', () => {
    test('should return environment variable when it exists', () => {
      process.env.TEST_VAR = 'test-value'
      expect(env('TEST_VAR')).toBe('test-value')
    })

    test('should return fallback when env var does not exist', () => {
      expect(env('NON_EXISTENT_VAR', 'fallback')).toBe('fallback')
    })

    test('should return empty string when no env var and no fallback', () => {
      expect(env('NON_EXISTENT_VAR')).toBe('')
    })

    test('should handle empty string env var', () => {
      process.env.EMPTY_VAR = ''
      expect(env('EMPTY_VAR', 'fallback')).toBe('fallback')
    })

    test('should handle null fallback', () => {
      expect(env('NON_EXISTENT_VAR', null as any)).toBe('')
    })
  })

  describe('envOr', () => {
    test('should return fallback when env var does not exist', () => {
      expect(envOr('NON_EXISTENT_VAR', 'fallback')).toBe('fallback')
    })

    test('should handle empty string env var', () => {
      process.env.EMPTY_VAR = ''
      expect(envOr('EMPTY_VAR', 'fallback')).toBe('fallback')
    })

    test('should return empty string when env var exists', () => {
      process.env.TEST_VAR = 'test-value'
      expect(envOr('TEST_VAR', 'fallback')).toBe('')
    })

    test('should handle no fallback provided', () => {
      expect(envOr('NON_EXISTENT_VAR')).toBe('')
    })
  })
})
