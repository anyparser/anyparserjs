import { expect, test, describe } from 'vitest'
import { validateOption } from '@src/validator/option.ts'
import { OCR_LANGUAGES, OCR_PRESETS } from '@src/config/hardcoded.ts'

describe('validateOption', () => {
  test('should validate options with apiUrl', () => {
    const validOption = {
      apiUrl: new URL('https://api.example.com')
    }
    expect(() => validateOption(validOption)).not.toThrow()
  })

  test('should throw error for missing apiUrl', () => {
    const invalidOption = {
      apiUrl: undefined
    }
    expect(() => validateOption(invalidOption)).toThrow('API URL is required')
  })

  test('should validate options with valid OCR language', () => {
    const validOption = {
      apiUrl: new URL('https://api.example.com'),
      ocrLanguage: [Object.values(OCR_LANGUAGES)[0]]
    }
    expect(() => validateOption(validOption)).not.toThrow()
  })

  test('should throw error for invalid OCR language', () => {
    const invalidOption = {
      apiUrl: new URL('https://api.example.com'),
      ocrLanguage: ['invalid-language'] as any // eslint-disable-line @typescript-eslint/no-explicit-any
    }
    expect(() => validateOption(invalidOption)).toThrow('Invalid OCR language')
  })

  test('should validate options with valid OCR preset', () => {
    const validOption = {
      apiUrl: new URL('https://api.example.com'),
      ocrPreset: Object.values(OCR_PRESETS)[0]
    }
    expect(() => validateOption(validOption)).not.toThrow()
  })

  test('should throw error for invalid OCR preset', () => {
    const invalidOption = {
      apiUrl: new URL('https://api.example.com'),
      ocrPreset: 'invalid-preset' as any // eslint-disable-line @typescript-eslint/no-explicit-any
    }
    expect(() => validateOption(invalidOption)).toThrow('Invalid OCR preset')
  })

  test('should validate options with both valid OCR language and preset', () => {
    const validOption = {
      apiUrl: new URL('https://api.example.com'),
      ocrLanguage: [Object.values(OCR_LANGUAGES)[0]],
      ocrPreset: Object.values(OCR_PRESETS)[0]
    }
    expect(() => validateOption(validOption)).not.toThrow()
  })
})
