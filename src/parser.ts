import { wrappedFetch } from '@src/utils/fetcher.ts'
import type { AnyparserOption, Result } from '@anyparser/core'
import { buildForm } from './form.ts'
import { validateAndParse } from './validator/index.ts'
import { transformToCamel } from '@src/utils/camel-case.ts'

/**
 * Main class for parsing items using the Anyparser API.
 */
export class Anyparser {
  public options?: AnyparserOption

  /**
   * Initialize the parser with optional configuration.
   * @param options - Configuration options for the parser
   */
  constructor (options?: AnyparserOption) {
    this.options = options
  }

  /**
   * Parse files using the Anyparser API.
   * @param filePathsOrUrl - A single file path or list of file paths to parse, or a start URL for crawling
   * @returns List of parsed file results if format is JSON, or raw text content if format is text/markdown
   * @throws Error if the API request fails
   */
  async parse (filePathsOrUrl: string | string[]): Promise<Result> {
    const parsed = await validateAndParse(filePathsOrUrl, this.options)
    const { apiUrl, apiKey } = parsed

    const formData = buildForm(parsed)

    const fetchOptions = {
      method: 'POST',
      body: formData,
      headers: {
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {})
      }
    }

    const url = new URL('/parse/v1', apiUrl)

    const response = await wrappedFetch(url, fetchOptions)

    switch (parsed.format) {
      case 'json':
        return transformToCamel<Result>(await response.json())
      case 'markdown':
      case 'html':
        return await response.text()
      default:
        throw new Error(`Unsupported format: ${parsed.format}`)
    }
  }
}
