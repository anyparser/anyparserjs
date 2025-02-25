/**
 * Configuration module for Anyparser default options
 * @module options.default
 */

import { FALLBACK_API_URL } from '@/config/hardcoded.ts'
import { env } from '@src/utils/env.ts'
import type { AnyparserOption } from '@anyparser/core'

/**
 * Retrieves and validates the API URL from environment or fallback
 * @returns {URL} Valid API URL instance
 */
export const getApiUrl = (): URL => {
  const value = env('ANYPARSER_API_URL', FALLBACK_API_URL)

  try {
    return new URL(value)
  } catch {
    console.error('Invalid API URL %s', value)
  }

  console.debug('Defaulting to %s', FALLBACK_API_URL)

  return new URL(FALLBACK_API_URL)
}

/**
 * Default configuration options for Anyparser
 * @type {Option}
 */
export const defaultOptions: AnyparserOption = {
  apiUrl: getApiUrl(),
  apiKey: env('ANYPARSER_API_KEY'),
  format: 'json',
  model: 'text',
  image: true,
  table: true
}
