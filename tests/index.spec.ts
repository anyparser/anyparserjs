import { expect, test, describe } from 'vitest'
import * as index from '@anyparser/core'

describe('index', () => {
  test('should export all required modules and types', () => {
    expect(index.OCR_LANGUAGES).toBeDefined()
    expect(index.OCR_PRESETS).toBeDefined()
    expect(typeof index.Anyparser).toBe('function')
  })
})
