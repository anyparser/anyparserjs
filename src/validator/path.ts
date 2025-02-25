/**
 * Validation module for file paths
 * @module validation
 */

import { access } from 'node:fs/promises'
import type { PathValidationResult } from './validation.d.ts'

/**
 * Validates file paths exist and are accessible
 * @param {string|string[]} filePaths - Single path or array of paths
 * @returns {Promise<PathValidationResult>} Validation result
 */
export const validatePath = async (filePaths: string | string[]): Promise<PathValidationResult> => {
  // Add input validation
  if (!filePaths) {
    return {
      valid: false,
      error: new Error('No files provided')
    }
  }

  const files = Array.isArray(filePaths) ? filePaths : [filePaths]

  if (files.length === 0) {
    return {
      valid: false,
      error: new Error('No files provided')
    }
  }

  for (const filePath of files) {
    try {
      await access(filePath)
    } catch (error) {
      return {
        valid: false,
        error: error as Error
      }
    }
  }

  return {
    valid: true,
    files
  }
}
