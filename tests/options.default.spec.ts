import { expect, test, describe, beforeEach, vi } from 'vitest'
import { getApiUrl } from '@src/options.default.ts'

describe('options.default', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv }
    vi.resetAllMocks()
  })

  test('should handle invalid API URL', () => {
    process.env.ANYPARSER_API_URL = 'invalid-url'
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {})

    const url = getApiUrl()

    expect(url.toString()).toBe('https://anyparserapi.com/')
    expect(consoleSpy).toHaveBeenCalledWith('Invalid API URL %s', 'invalid-url')
    expect(debugSpy).toHaveBeenCalledWith('Defaulting to %s', 'https://anyparserapi.com')
  })
})
