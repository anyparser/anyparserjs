import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest'
import { WrappedError, wrappedFetch } from '@src/utils/fetcher.ts'

describe('[Utils] -> Fetcher', () => {
  let originalFetch: typeof fetch

  beforeEach(() => {
    originalFetch = globalThis.fetch
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
    vi.restoreAllMocks()
  })

  describe('wrappedFetch', () => {
    it('should successfully fetch when response is ok', async () => {
      const mockResponse = new Response('{"data": "test"}', {
        status: 200,
        statusText: 'OK'
      })
      globalThis.fetch = vi.fn().mockResolvedValue(mockResponse)

      const response = await wrappedFetch('https://example.com')
      expect(response).toBe(mockResponse)
    })

    it('should throw WrappedError when response is not ok', async () => {
      const errorText = 'Not Found'
      const mockResponse = new Response(errorText, {
        status: 404,
        statusText: 'Not Found'
      })
      globalThis.fetch = vi.fn().mockResolvedValue(mockResponse)

      await expect(wrappedFetch('https://example.com')).rejects.toThrow(WrappedError)
    })

    it('should pass through fetch options', async () => {
      const mockResponse = new Response('{}', {
        status: 200,
        statusText: 'OK'
      })
      const fetchSpy = vi.fn().mockResolvedValue(mockResponse)
      globalThis.fetch = fetchSpy

      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: true })
      }

      await wrappedFetch('https://example.com', options)
      expect(fetchSpy).toHaveBeenCalledWith('https://example.com', options)
    })
  })
})
