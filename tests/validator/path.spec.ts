import { describe, beforeEach, test, expect, vi } from 'vitest'
import * as fs from 'node:fs/promises'
import { validatePath } from '@src/validator/path.ts'

vi.mock('node:fs/promises')

describe('path validator', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  test('should validate single existing file', async () => {
    vi.mocked(fs.access).mockResolvedValue(undefined)

    const result = await validatePath('test.pdf')
    expect(result).toEqual({
      valid: true,
      files: ['test.pdf']
    })
  })

  test('should validate multiple existing files', async () => {
    vi.mocked(fs.access).mockResolvedValue(undefined)

    const files = ['test1.pdf', 'test2.pdf']
    const result = await validatePath(files)
    expect(result).toEqual({
      valid: true,
      files
    })
    expect(fs.access).toHaveBeenCalledTimes(2)
  })

  test('should handle non-existent file', async () => {
    const error = new Error('File not found')
    vi.mocked(fs.access).mockRejectedValue(error)

    const result = await validatePath('missing.pdf')
    expect(result).toEqual({
      valid: false,
      error: expect.objectContaining({
        message: 'File not found'
      })
    })
  })

  test('should handle empty array of files', async () => {
    const result = await validatePath([])
    expect(result).toEqual({
      valid: false,
      error: expect.objectContaining({
        message: 'No files provided'
      })
    })
  })

  test('should handle undefined input', async () => {
    const result = await validatePath(undefined as any)
    expect(result).toEqual({
      valid: false,
      error: expect.objectContaining({
        message: 'No files provided'
      })
    })
  })
})
