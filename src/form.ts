/* eslint-disable complexity */

/**
 * Form data builder module for creating multipart form data for API requests.
 * @module form
 */

import type { AnyparserParsedOption } from './anyparser.d.ts'

/**
 * Builds multipart form data from parsed options.
 * @param parsed - Validated parser options
 * @returns Form data for API request
 */
export function buildForm (parsed: AnyparserParsedOption): FormData {
  const formData = new FormData()

  // Add regular form fields
  formData.append('format', parsed.format)
  formData.append('model', parsed.model)

  // Only add image and table fields if not using OCR model or crawler model
  if (parsed.model !== 'ocr' && parsed.model !== 'crawler') {
    if (parsed.image !== undefined) {
      formData.append('image', String(parsed.image))
    }

    if (parsed.table !== undefined) {
      formData.append('table', String(parsed.table))
    }
  }

  // Add OCR-specific fields
  if (parsed.model === 'ocr') {
    if (parsed.ocrLanguage?.length) {
      formData.append('ocrLanguage', parsed.ocrLanguage.join(','))
    }

    if (parsed.ocrPreset) {
      formData.append('ocrPreset', parsed.ocrPreset)
    }
  }

  // Add crawler-specific fields
  if (parsed.model === 'crawler') {
    formData.append('url', parsed.url ?? '')

    if (parsed.maxDepth !== undefined) {
      formData.append('maxDepth', String(parsed.maxDepth))
    }

    if (parsed.maxExecutions !== undefined) {
      formData.append('maxExecutions', String(parsed.maxExecutions))
    }

    if (parsed.strategy) {
      formData.append('strategy', parsed.strategy)
    }

    if (parsed.traversalScope) {
      formData.append('traversalScope', parsed.traversalScope)
    }
  } else {
    // Add files to the form for non-crawler models
    if (parsed.files) {
      for (const file of parsed.files) {
        formData.append('files', file.contents, file.fileName)
      }
    }
  }

  return formData
}
