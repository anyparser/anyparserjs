import { describe, test, expect, vi, beforeEach } from 'vitest'
import * as fs from 'node:fs/promises'
import * as fsapi from 'node:fs'
import { validateAndParse } from '@src/validator/index.ts'
import type { AnyparserOption } from '@anyparser/core'

vi.mock('node:fs/promises')
vi.mock('node:fs')

describe('validator', () => {
  const mockApiUrl = new URL('https://api.example.com')
  const mockApiKey = 'test-key'
  const mockOptions = { apiKey: mockApiKey, apiUrl: mockApiUrl }

  beforeEach(() => {
    vi.resetAllMocks()
  })

  test('should validate and parse file mode', async () => {
    vi.mocked(fs.access).mockResolvedValue(undefined)

    vi.mocked(fs.open).mockImplementation(async () => Promise.resolve({
      close: async () => await new Promise(resolve => setTimeout(resolve, 1))
    } as any)) // eslint-disable-line @typescript-eslint/no-explicit-any

    vi.mocked(fsapi.createReadStream).mockImplementationOnce(() => ({
      [Symbol.asyncIterator]: async function * () {
        await new Promise(resolve => setTimeout(resolve, 1))
        yield Buffer.from('test')
      }
    }) as any) // eslint-disable-line @typescript-eslint/no-explicit-any

    const result = await validateAndParse('test.pdf', mockOptions)

    expect(result).toMatchObject({
      files: [expect.objectContaining({
        fileName: 'test.pdf'
      })]
    })
  })

  test('should validate and parse crawler mode', async () => {
    const options: AnyparserOption = {
      ...mockOptions,
      model: 'crawler'
    }

    const result = await validateAndParse('https://example.com', options)

    expect(result).toMatchObject({
      model: 'crawler',
      url: 'https://example.com/'
    })
  })

  test('should handle file access errors', async () => {
    const error = new Error('File locked')
    Object.assign(error, { code: 'EBUSY' })
    vi.mocked(fs.access).mockResolvedValue(undefined)
    vi.mocked(fs.open).mockRejectedValue(error)

    await expect(validateAndParse('locked.pdf', mockOptions))
      .rejects.toThrow('File locked.pdf is locked by another process')
  })

  test('should validate format', async () => {
    await expect(validateAndParse('test.pdf', {
      ...mockOptions,
      format: 'invalid' as any // eslint-disable-line @typescript-eslint/no-explicit-any
    })).rejects.toThrow('Unsupported format: invalid')
  })

  test('should handle ENOENT error during file access', async () => {
    const error = new Error('File not found')
    Object.assign(error, { code: 'ENOENT' })
    vi.mocked(fs.access).mockRejectedValue(error)

    await expect(validateAndParse('missing.pdf', mockOptions))
      .rejects.toThrow('File not found')
  })

  test('should handle ELOCK error during file open', async () => {
    const error = new Error('File locked')
    Object.assign(error, { code: 'ELOCK' })
    vi.mocked(fs.access).mockResolvedValue(undefined)
    vi.mocked(fs.open).mockRejectedValue(error)

    await expect(validateAndParse('locked.pdf', mockOptions))
      .rejects.toThrow('File locked.pdf is locked by another process')
  })

  test('should handle other file access errors', async () => {
    const error = new Error('Unknown error')
    vi.mocked(fs.access).mockRejectedValue(error)

    await expect(validateAndParse('error.pdf', mockOptions))
      .rejects.toThrow('Unknown error')
  })

  test('should handle multiple files in crawler mode', async () => {
    const options: AnyparserOption = {
      ...mockOptions,
      model: 'crawler'
    }

    const result = await validateAndParse(['https://example.com'], options)

    expect(result).toMatchObject({
      model: 'crawler',
      url: 'https://example.com/'
    })
  })

  test('should handle empty file paths', async () => {
    await expect(validateAndParse([], mockOptions))
      .rejects.toThrow('No files provided')
  })

  test('should handle file read errors', async () => {
    vi.mocked(fs.access).mockResolvedValue(undefined)
    const mockFileHandle = {
      close: vi.fn().mockResolvedValue(undefined)
    }
    vi.mocked(fs.open).mockResolvedValue(mockFileHandle as any) // eslint-disable-line @typescript-eslint/no-explicit-any

    vi.mocked(fsapi.createReadStream).mockImplementationOnce(() => {
      throw new Error('Read error')
    })

    await expect(validateAndParse('error.pdf', mockOptions))
      .rejects.toThrow('Read error')
  })

  test('should handle invalid URL in crawler mode', async () => {
    const options: AnyparserOption = {
      ...mockOptions,
      model: 'crawler'
    }

    await expect(validateAndParse('not-a-url', options))
      .rejects.toThrow('Invalid URL')
  })

  test('should handle file stream errors', async () => {
    vi.mocked(fs.access).mockResolvedValue(undefined)
    const mockFileHandle = {
      close: vi.fn().mockResolvedValue(undefined)
    }
    vi.mocked(fs.open).mockResolvedValue(mockFileHandle as any) // eslint-disable-line @typescript-eslint/no-explicit-any

    vi.mocked(fsapi.createReadStream).mockImplementationOnce(() => ({
      [Symbol.asyncIterator]: async function * () {
        await new Promise(resolve => setTimeout(resolve, 1))
        throw new Error('Stream error')
      }
    }) as any) // eslint-disable-line @typescript-eslint/no-explicit-any

    await expect(validateAndParse('error.pdf', mockOptions))
      .rejects.toThrow('Stream error')
  })

  test('should handle file close errors', async () => {
    vi.mocked(fs.access).mockResolvedValue(undefined)
    const mockFileHandle = {
      close: vi.fn().mockRejectedValue(new Error('Close error'))
    }
    vi.mocked(fs.open).mockResolvedValue(mockFileHandle as any)

    await expect(validateAndParse('error.pdf', mockOptions))
      .rejects.toThrow('Close error')
  })

  test('should handle invalid file extensions', async () => {
    vi.mocked(fs.access).mockResolvedValue(undefined)

    const mockFileHandle = {
      close: vi.fn().mockResolvedValue(undefined)
    }

    vi.mocked(fs.open).mockResolvedValue(mockFileHandle as any) // eslint-disable-line @typescript-eslint/no-explicit-any

    vi.mocked(fsapi.createReadStream).mockImplementationOnce(() => {
      throw new Error('Unsupported file extension')
    })

    await expect(validateAndParse('test.invalid', mockOptions))
      .rejects.toThrow('Unsupported file extension')
  })
})
