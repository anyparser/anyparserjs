import { expect, test, describe, vi, beforeEach } from 'vitest'
import * as fs from 'node:fs/promises'
import { validateAndParse } from '@src/validator/index.ts'
import * as path from '@src/validator/path.ts'
import type { AnyparserOption } from '@anyparser/core'
import type { AnyparserFormatType } from '@src/anyparser.d.ts'

vi.mock('node:fs/promises')
vi.mock('node:fs', () => ({
  createReadStream: vi.fn(() => ({
    [Symbol.asyncIterator]: async function * () {
      await new Promise(resolve => setTimeout(resolve, 1))
      yield Buffer.from('test')
    }
  }))
}))

class ErrorWithCode extends Error {
  private errorCode: string

  constructor (message: string) {
    super(message)
    this.name = 'ErrorWithCode'
    this.errorCode = ''
  }

  get code (): string {
    return this.errorCode
  }

  // Setter for the code
  set code (value: string) {
    this.errorCode = value
  }
}

vi.mock('@src/validator/path')

describe('validator', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  test('should handle file not found error', async () => {
    const error = new Error('File was not found')
    vi.mocked(fs.access).mockRejectedValue(error)
    vi.mocked(path.validatePath).mockResolvedValue({ valid: true, files: ['removed.pdf'] })

    await expect(validateAndParse(['removed.pdf'], {
      apiKey: 'test-key',
      apiUrl: new URL('https://api.example.com')
    })).rejects.toMatchObject(error)
  })

  test('should validate and parse crawler mode', async () => {
    const options:AnyparserOption = {
      model: 'crawler',
      apiKey: 'test-key',
      apiUrl: new URL('https://api.example.com')
    }

    const result = await validateAndParse('https://example.com', options)

    expect(result).toMatchObject({
      model: 'crawler',
      url: 'https://example.com/',
      apiKey: 'test-key',
      apiUrl: expect.any(URL)
    })
  })

  test('should handle EBUSY file locked error', async () => {
    vi.mocked(fs.access).mockResolvedValue(undefined)
    const error = new ErrorWithCode('File locked.pdf is locked by another process')
    error.code = 'EBUSY'
    vi.mocked(fs.open).mockRejectedValue(error)
    vi.mocked(path.validatePath).mockResolvedValue({ valid: true, files: ['locked.pdf'] })

    await expect(validateAndParse(['locked.pdf'], {
      apiKey: 'test-key',
      apiUrl: new URL('https://api.example.com')
    })).rejects.toMatchObject({
      message: 'File locked.pdf is locked by another process'
    })
  })

  test('should handle ELOCK file locked error', async () => {
    vi.mocked(fs.access).mockResolvedValue(undefined)
    const error = new ErrorWithCode('File locked.pdf is locked by another process')
    error.code = 'ELOCK'
    vi.mocked(fs.open).mockRejectedValue(error)
    vi.mocked(path.validatePath).mockResolvedValue({ valid: true, files: ['locked.pdf'] })

    await expect(validateAndParse(['locked.pdf'], {
      apiKey: 'test-key',
      apiUrl: new URL('https://api.example.com')
    })).rejects.toMatchObject({
      message: 'File locked.pdf is locked by another process'
    })
  })

  test('should handle non-Error access error', async () => {
    const nonError = { message: 'Not an Error instance' }
    vi.mocked(fs.access).mockRejectedValue(nonError)
    vi.mocked(path.validatePath).mockResolvedValue({ valid: true, files: ['file.pdf'] })

    await expect(validateAndParse(['file.pdf'], {
      apiKey: 'test-key',
      apiUrl: new URL('https://api.example.com')
    })).rejects.toEqual(nonError)
  })

  test('should handle ENOENT error during access', async () => {
    const error = new Error('File not found') as any // eslint-disable-line @typescript-eslint/no-explicit-any
    error.code = 'ENOENT'
    vi.mocked(fs.access).mockRejectedValue(error)
    vi.mocked(path.validatePath).mockResolvedValue({ valid: true, files: ['missing.pdf'] })

    await expect(validateAndParse(['missing.pdf'], {
      apiKey: 'test-key',
      apiUrl: new URL('https://api.example.com')
    })).rejects.toThrowError('File missing.pdf was not found or was removed')
  })

  test('should handle Error without code', async () => {
    const error = new Error('Generic error without code')
    vi.mocked(fs.access).mockRejectedValue(error)
    vi.mocked(path.validatePath).mockResolvedValue({ valid: true, files: ['file.pdf'] })

    await expect(validateAndParse(['file.pdf'], {
      apiKey: 'test-key',
      apiUrl: new URL('https://api.example.com')
    })).rejects.toEqual(error)
  })

  test('should validate and parse file mode', async () => {
    vi.mocked(fs.access).mockResolvedValue(undefined)
    vi.mocked(path.validatePath).mockResolvedValue({ valid: true, files: ['test.pdf'] })

    const mockFileHandle = {
      close: vi.fn().mockResolvedValue(undefined)
    }

    vi.mocked(fs.open).mockResolvedValue(mockFileHandle as any) // eslint-disable-line @typescript-eslint/no-explicit-any

    const options = {
      apiKey: 'test-key',
      apiUrl: new URL('https://api.example.com')
    }

    const result = await validateAndParse('test.pdf', options)

    expect(result).toMatchObject({
      files: [expect.objectContaining({
        fileName: 'test.pdf'
      })]
    })
  })

  test('should handle file access errors', async () => {
    const error = new Error('File locked')
    Object.assign(error, { code: 'EBUSY' })
    vi.mocked(fs.access).mockResolvedValue(undefined)
    vi.mocked(fs.open).mockRejectedValue(error)
    vi.mocked(path.validatePath).mockResolvedValue({ valid: true, files: ['locked.pdf'] })

    await expect(validateAndParse('locked.pdf', {
      apiKey: 'test-key',
      apiUrl: new URL('https://api.example.com')
    })).rejects.toThrow('File locked.pdf is locked by another process')
  })

  test('should validate format', async () => {
    vi.mocked(path.validatePath).mockResolvedValue({ valid: true, files: ['test.pdf'] })
    vi.mocked(fs.access).mockResolvedValue(undefined)

    const mockFileHandle = {
      close: vi.fn().mockResolvedValue(undefined)
    }
    vi.mocked(fs.open).mockResolvedValue(mockFileHandle as any) // eslint-disable-line @typescript-eslint/no-explicit-any

    // Test invalid format
    await expect(validateAndParse('test.pdf', {
      apiKey: 'test-key',
      apiUrl: new URL('https://api.example.com'),
      format: 'invalid' as any // eslint-disable-line @typescript-eslint/no-explicit-any
    })).rejects.toThrow('Unsupported format: invalid')

    // Test all valid formats
    for (const format of ['json', 'markdown', 'html']) {
      const result = await validateAndParse('test.pdf', {
        apiKey: 'test-key',
        apiUrl: new URL('https://api.example.com'),
        format: format as AnyparserFormatType
      })

      expect(result.format).toBe(format)
    }
  })

  test('should handle ENOENT error during file access', async () => {
    const error = new Error('File not found')
    Object.assign(error, { code: 'ENOENT' })

    vi.mocked(fs.access).mockRejectedValue(error)
    vi.mocked(path.validatePath).mockResolvedValue({ valid: true, files: ['missing.pdf'] })

    await expect(validateAndParse('missing.pdf', {
      apiKey: 'test-key',
      apiUrl: new URL('https://api.example.com')
    })).rejects.toThrow('File missing.pdf was not found or was removed')
  })

  test('should handle ELOCK error during file open', async () => {
    const error = new Error('File locked')
    Object.assign(error, { code: 'ELOCK' })
    vi.mocked(fs.access).mockResolvedValue(undefined)
    vi.mocked(fs.open).mockRejectedValue(error)
    vi.mocked(path.validatePath).mockResolvedValue({ valid: true, files: ['locked.pdf'] })

    await expect(validateAndParse('locked.pdf', {
      apiKey: 'test-key',
      apiUrl: new URL('https://api.example.com')
    })).rejects.toThrow('File locked.pdf is locked by another process')
  })

  test('should handle other file access errors', async () => {
    const error = new Error('Unknown error')
    vi.mocked(fs.access).mockRejectedValue(error)
    vi.mocked(path.validatePath).mockResolvedValue({ valid: true, files: ['error.pdf'] })

    await expect(validateAndParse('error.pdf', {
      apiKey: 'test-key',
      apiUrl: new URL('https://api.example.com')
    })).rejects.toThrow('Unknown error')
  })

  test('should handle multiple files in crawler mode', async () => {
    const options:AnyparserOption = {
      model: 'crawler',
      apiKey: 'test-key',
      apiUrl: new URL('https://api.example.com')
    }

    const result = await validateAndParse(['https://example.com'], options)

    expect(result).toMatchObject({
      model: 'crawler',
      url: 'https://example.com/',
      apiKey: 'test-key',
      apiUrl: expect.any(URL)
    })
  })

  test('should handle all option combinations', async () => {
    vi.mocked(path.validatePath).mockResolvedValue({ valid: true, files: ['test.pdf'] })
    vi.mocked(fs.access).mockResolvedValue(undefined)

    const mockFileHandle = {
      close: vi.fn().mockResolvedValue(undefined)
    }
    vi.mocked(fs.open).mockResolvedValue(mockFileHandle as any) // eslint-disable-line @typescript-eslint/no-explicit-any

    // Test with minimal options
    const result1 = await validateAndParse('test.pdf', {
      apiKey: 'test-key',
      apiUrl: new URL('https://api.example.com')
    })
    expect(result1).toMatchObject({
      format: 'json',
      model: 'text',
      image: true,
      table: true
    })

    // Test with all options specified
    const result2 = await validateAndParse('test.pdf', {
      apiKey: 'test-key',
      apiUrl: new URL('https://api.example.com'),
      format: 'json',
      model: 'text',
      image: false,
      table: false,
      ocrLanguage: ['eng'],
      ocrPreset: 'document',
      url: 'https://example.com',
      maxDepth: 2,
      maxExecutions: 100,
      strategy: 'FIFO'
    })
    expect(result2).toMatchObject({
      format: 'json',
      model: 'text',
      image: false,
      table: false,
      ocrLanguage: ['eng'],
      ocrPreset: 'document',
      url: 'https://example.com',
      maxDepth: 2,
      maxExecutions: 100,
      strategy: 'FIFO'
    })
  })

  test('should handle EBUSY error during file open', async () => {
    const error = new Error('File is busy')
    Object.assign(error, { code: 'EBUSY' })
    vi.mocked(fs.access).mockResolvedValue(undefined)
    vi.mocked(fs.open).mockRejectedValue(error)
    vi.mocked(path.validatePath).mockResolvedValue({ valid: true, files: ['busy.pdf'] })

    await expect(validateAndParse('busy.pdf', {
      apiKey: 'test-key',
      apiUrl: new URL('https://api.example.com')
    })).rejects.toThrow('File busy.pdf is locked by another process')
  })

  test('should handle other errors during file open', async () => {
    const error = new Error('Other error')
    Object.assign(error, { code: 'OTHER' })
    vi.mocked(fs.access).mockResolvedValue(undefined)
    vi.mocked(fs.open).mockRejectedValue(error)
    vi.mocked(path.validatePath).mockResolvedValue({ valid: true, files: ['error.pdf'] })

    await expect(validateAndParse('error.pdf', {
      apiKey: 'test-key',
      apiUrl: new URL('https://api.example.com')
    })).rejects.toThrow('Other error')
  })
})
