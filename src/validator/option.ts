/**
 * Validation module for options
 * @module validation
 */

import { isNullOrUndefined } from '@src/utils/nullable.ts'
import type { AnyparserOption } from '@anyparser/core'
import { OCR_LANGUAGES, OCR_PRESETS } from '../config/hardcoded.ts'

/**
 * Validates parsing options configuration
 * @param {Option} parsed - Options to validate
 * @throws {Error} If validation fails
 */
export const validateOption = (parsed: AnyparserOption) => {
  if (isNullOrUndefined(parsed.apiUrl)) {
    throw new Error('API URL is required')
  }

  if (!isNullOrUndefined(parsed.ocrLanguage)) {
    parsed.ocrLanguage.forEach((language: string) => {
      if (!Object.values(OCR_LANGUAGES as Record<string, string>).includes(language)) {
        throw new Error('Invalid OCR language')
      }
    })
  }

  if (!isNullOrUndefined(parsed.ocrPreset)) {
    if (!Object.values(OCR_PRESETS as Record<string, string>).includes(parsed.ocrPreset)) {
      throw new Error('Invalid OCR preset')
    }
  }
}
