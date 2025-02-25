/**
 * Options module for Anyparser configuration and parsing.
 * @module options
 */

import type { AnyparserOption, AnyparserParsedOption } from './anyparser.d.ts'
import { defaultOptions } from './options.default.ts'

/**
 * Validate API key format and presence
 * @param apiKey - API key to validate
 * @throws {Error} If API key is invalid or missing
 */
export function validateApiKey (apiKey: string | undefined): void {
  if (!apiKey) {
    throw new Error('API key is required')
  }

  if (typeof apiKey !== 'string' || apiKey.trim().length === 0) {
    throw new Error('API key must be a non-empty string')
  }
}

/**
 * Build final options by merging defaults with provided options.
 * @param options - User-provided options to override defaults
 * @returns Complete options with all required fields
 * @throws {Error} If required options are missing or invalid
 */
export function buildOptions (options?: AnyparserOption): AnyparserParsedOption {
  const mergedOptions = { ...defaultOptions, ...options }

  validateApiKey(mergedOptions.apiKey)

  if (!mergedOptions.apiUrl) {
    throw new Error('API URL is required')
  }

  const parsedOptions: AnyparserParsedOption = {
    apiUrl: mergedOptions.apiUrl,
    apiKey: mergedOptions.apiKey as string,
    format: mergedOptions.format || 'json',
    model: mergedOptions.model || 'text',
    encoding: mergedOptions.encoding || 'utf-8',
    image: mergedOptions.image,
    table: mergedOptions.table,
    ocrLanguage: mergedOptions.ocrLanguage,
    ocrPreset: mergedOptions.ocrPreset,
    url: mergedOptions.url,
    maxDepth: mergedOptions.maxDepth,
    maxExecutions: mergedOptions.maxExecutions,
    strategy: mergedOptions.strategy,
    traversalScope: mergedOptions.traversalScope
  }

  return parsedOptions
}
