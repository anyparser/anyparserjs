/**
 * Option validation and parsing module
 * @module validator
 */
import * as fsapi from 'node:fs'
import { basename } from 'node:path'
import * as fs from 'node:fs/promises'
import type { AnyparserOption, AnyparserParsedOption } from '../anyparser.d.ts'
import { buildOptions } from '../options.ts'
import { validateOption } from './option.ts'
import { validatePath } from './path.ts'
import type { ValidPathValidationResult } from './validation.d.ts'
import { getURLToCrawl } from './crawler.ts'

/**
 * Check if a file is accessible and not locked
 * @param filePath - Path to the file to check
 * @returns Promise that resolves when file is accessible, rejects if file is locked or not found
 */
async function checkFileAccess (filePath: string): Promise<void> {
  try {
    await fs.access(filePath)
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      throw new Error(`File ${filePath} was not found or was removed`)
    }

    throw error
  }

  try {
    // Try to open file for reading to check if it's locked
    const fileHandle = await fs.open(filePath, 'r')
    await fileHandle.close()
  } catch (error) {
    if (error instanceof Error && 'code' in error && (error.code === 'EBUSY' || error.code === 'ELOCK')) {
      throw new Error(`File ${filePath} is locked by another process`)
    }

    throw error
  }
}

/**
 * Validates options and processes input files
 * @param filePaths - Files to process
 * @param options - Parser options
 * @returns Processed options and files
 */
export async function validateAndParse (
  filePaths: string | string[],
  options?: AnyparserOption
): Promise<AnyparserParsedOption> {
  const parsed = buildOptions(options)
  validateOption(parsed)

  if (!['json', 'markdown', 'html'].includes(parsed.format)) {
    throw new Error(`Unsupported format: ${parsed.format}`)
  }

  // Determine if we're in crawler mode
  const isCrawler = options?.model === 'crawler'

  // Validate URL for crawler mode, otherwise validate file paths
  const result = isCrawler ?
      { valid: true, files: [getURLToCrawl(filePaths)] } as ValidPathValidationResult :
    await validatePath(filePaths)

  if (result.valid === false) {
    throw result.error
  }

  const parsedOption: AnyparserParsedOption = {
    apiUrl: parsed.apiUrl,
    apiKey: parsed.apiKey,
    format: parsed.format,
    model: parsed.model,
    image: parsed.image,
    table: parsed.table,
    ocrLanguage: parsed.ocrLanguage,
    ocrPreset: parsed.ocrPreset,
    url: parsed.url,
    maxDepth: parsed.maxDepth,
    maxExecutions: parsed.maxExecutions,
    strategy: parsed.strategy,
    traversalScope: parsed.traversalScope,
    encoding: parsed.encoding
  }

  // Handle crawler mode
  if (isCrawler) {
    parsedOption.url = result.files[0]
  } else {
    // Process files for non-crawler mode
    const processed = []

    for (const filePath of result.files) {
      await checkFileAccess(filePath)

      const fileStream = fsapi.createReadStream(filePath)
      const chunks = []

      for await (const chunk of fileStream) {
        chunks.push(chunk)
      }

      const buffer = Buffer.concat(chunks)
      const contents = new File([buffer], basename(filePath), {
        type: 'application/octet-stream'
      })

      processed.push({
        fileName: basename(filePath),
        contents
      })
    }

    parsedOption.files = processed
  }

  return parsedOption
}
