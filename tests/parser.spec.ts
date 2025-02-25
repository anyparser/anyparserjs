import { describe, test, expect, vi, beforeEach } from 'vitest'
import { Anyparser } from '@src/parser.ts'
import * as validator from '@src/validator/index.ts'
import * as form from '@src/form.ts'
import { wrappedFetch } from '@src/utils/fetcher.ts'

// Mock dependencies
vi.mock('@src/validator')
vi.mock('@src/form')
vi.mock('@src/utils/fetcher.ts')

describe('Anyparser', () => {
  const mockApiUrl = new URL('https://api.example.com')
  const mockApiKey = 'test-key'
  const mockOptions = { apiKey: mockApiKey, apiUrl: mockApiUrl }

  beforeEach(() => {
    vi.resetAllMocks()
  })

  test('constructor should initialize with options', () => {
    const parser = new Anyparser(mockOptions)
    expect(parser.options).toBe(mockOptions)
  })

  test('parse should handle JSON format', async () => {
    const mockValidateAndParse = vi.mocked(validator.validateAndParse)
    const mockBuildForm = vi.mocked(form.buildForm)
    const mockWrappedFetch = vi.mocked(wrappedFetch)

    const mockFormData = new FormData()
    const mockJsonResponse = { result: 'test_result' }
    const mockResponse = new Response(JSON.stringify(mockJsonResponse))

    mockValidateAndParse.mockResolvedValue({
      ...mockOptions,
      format: 'json',
      model: 'text',
      encoding: 'utf-8'
    })

    mockBuildForm.mockReturnValue(mockFormData)
    mockWrappedFetch.mockResolvedValue(mockResponse)

    const parser = new Anyparser(mockOptions)
    const result = await parser.parse('test.pdf')

    expect(mockValidateAndParse).toHaveBeenCalledWith('test.pdf', mockOptions)
    expect(mockBuildForm).toHaveBeenCalled()

    expect(mockWrappedFetch).toHaveBeenCalledWith(
      new URL('/parse/v1', mockApiUrl),
      {
        method: 'POST',
        body: mockFormData,
        headers: { Authorization: `Bearer ${mockApiKey}` }
      }
    )

    expect(result).toEqual(mockJsonResponse)
  })

  test('parse should handle text format', async () => {
    const mockValidateAndParse = vi.mocked(validator.validateAndParse)
    const mockBuildForm = vi.mocked(form.buildForm)
    const mockWrappedFetch = vi.mocked(wrappedFetch)

    const mockFormData = new FormData()
    const mockTextResponse = 'test result'
    const mockResponse = new Response(mockTextResponse)

    mockValidateAndParse.mockResolvedValue({
      ...mockOptions,
      format: 'markdown',
      model: 'text',
      encoding: 'utf-8'
    })
    mockBuildForm.mockReturnValue(mockFormData)
    mockWrappedFetch.mockResolvedValue(mockResponse)

    const parser = new Anyparser(mockOptions)
    const result = await parser.parse('test.pdf')

    expect(mockValidateAndParse).toHaveBeenCalledWith('test.pdf', mockOptions)
    expect(mockBuildForm).toHaveBeenCalled()
    expect(mockWrappedFetch).toHaveBeenCalledWith(
      new URL('/parse/v1', mockApiUrl),
      {
        method: 'POST',
        body: mockFormData,
        headers: { Authorization: `Bearer ${mockApiKey}` }
      }
    )
    expect(result).toBe(mockTextResponse)
  })

  test('parse should handle HTML format', async () => {
    const mockValidateAndParse = vi.mocked(validator.validateAndParse)
    const mockBuildForm = vi.mocked(form.buildForm)
    const mockWrappedFetch = vi.mocked(wrappedFetch)

    const mockFormData = new FormData()
    const mockHtmlResponse = '<div>test result</div>'
    const mockResponse = new Response(mockHtmlResponse)

    mockValidateAndParse.mockResolvedValue({
      ...mockOptions,
      format: 'html',
      model: 'text',
      encoding: 'utf-8'
    })
    mockBuildForm.mockReturnValue(mockFormData)
    mockWrappedFetch.mockResolvedValue(mockResponse)

    const parser = new Anyparser(mockOptions)
    const result = await parser.parse('test.pdf')

    expect(result).toBe(mockHtmlResponse)
  })

  test('parse should throw error for unsupported format', async () => {
    const mockValidateAndParse = vi.mocked(validator.validateAndParse)
    mockValidateAndParse.mockResolvedValue({
      ...mockOptions,
      format: 'invalid' as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      model: 'text',
      encoding: 'utf-8'
    })

    const parser = new Anyparser(mockOptions)
    await expect(parser.parse('test.pdf')).rejects.toThrow('Unsupported format: invalid')
  })

  test('parse should handle requests without API key', async () => {
    const mockValidateAndParse = vi.mocked(validator.validateAndParse)
    const mockBuildForm = vi.mocked(form.buildForm)
    const mockWrappedFetch = vi.mocked(wrappedFetch)

    const mockFormData = new FormData()
    const mockResponse = new Response('test')

    mockValidateAndParse.mockResolvedValue({
      apiUrl: mockApiUrl,
      format: 'markdown',
      model: 'text',
      encoding: 'utf-8',
      apiKey: ''
    })

    mockBuildForm.mockReturnValue(mockFormData)
    mockWrappedFetch.mockResolvedValue(mockResponse)

    const parser = new Anyparser({ apiUrl: mockApiUrl })
    await parser.parse('test.pdf')

    expect(mockWrappedFetch).toHaveBeenCalledWith(
      new URL('/parse/v1', mockApiUrl),
      {
        method: 'POST',
        body: mockFormData,
        headers: {}
      }
    )
  })
})
