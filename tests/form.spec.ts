import { expect, test, describe } from 'vitest'
import { buildForm } from '@src/form.ts'

describe('form', () => {
  const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' })

  test('should build basic form data', () => {
    const formData = buildForm({
      apiUrl: new URL('https://example.com'),
      apiKey: 'test-key',
      format: 'json',
      model: 'text',
      encoding: 'utf-8'
    })

    expect(formData.get('format')).toBe('json')
    expect(formData.get('model')).toBe('text')
  })

  test('should handle image and table options for non-OCR/crawler models', () => {
    const formData = buildForm({
      apiUrl: new URL('https://example.com'),
      apiKey: 'test-key',
      format: 'json',
      model: 'text',
      encoding: 'utf-8',
      image: true,
      table: true
    })

    expect(formData.get('image')).toBe('true')
    expect(formData.get('table')).toBe('true')
  })

  test('should not include image and table options for OCR model', () => {
    const formData = buildForm({
      apiUrl: new URL('https://example.com'),
      apiKey: 'test-key',
      format: 'json',
      model: 'ocr',
      encoding: 'utf-8',
      image: true,
      table: true,
      ocrLanguage: ['eng'],
      ocrPreset: 'document'
    })

    expect(formData.get('image')).toBeNull()
    expect(formData.get('table')).toBeNull()
    expect(formData.get('ocrLanguage')).toBe('eng')
    expect(formData.get('ocrPreset')).toBe('document')
  })

  test('should handle OCR options without language', () => {
    const formData = buildForm({
      apiUrl: new URL('https://example.com'),
      apiKey: 'test-key',
      format: 'json',
      model: 'ocr',
      encoding: 'utf-8',
      ocrPreset: 'document'
    })

    expect(formData.get('ocrLanguage')).toBeNull()
    expect(formData.get('ocrPreset')).toBe('document')
  })

  test('should handle crawler options with all fields', () => {
    const formData = buildForm({
      apiUrl: new URL('https://example.com'),
      apiKey: 'test-key',
      format: 'json',
      model: 'crawler',
      encoding: 'utf-8',
      url: 'https://example.com',
      maxDepth: 2,
      maxExecutions: 5,
      strategy: 'FIFO',
      traversalScope: 'domain'
    })

    expect(formData.get('url')).toBe('https://example.com')
    expect(formData.get('maxDepth')).toBe('2')
    expect(formData.get('maxExecutions')).toBe('5')
    expect(formData.get('strategy')).toBe('FIFO')
    expect(formData.get('traversalScope')).toBe('domain')
  })

  test('should handle crawler options with minimal fields', () => {
    const formData = buildForm({
      apiUrl: new URL('https://example.com'),
      apiKey: 'test-key',
      format: 'json',
      model: 'crawler',
      encoding: 'utf-8'
    })

    expect(formData.get('url')).toBe('')
    expect(formData.get('maxDepth')).toBeNull()
    expect(formData.get('maxExecutions')).toBeNull()
    expect(formData.get('strategy')).toBeNull()
    expect(formData.get('traversalScope')).toBeNull()
  })

  test('should handle multiple file uploads', () => {
    const mockFile2 = new File(['test2'], 'test2.pdf', { type: 'application/pdf' })
    const formData = buildForm({
      apiUrl: new URL('https://example.com'),
      apiKey: 'test-key',
      format: 'json',
      model: 'text',
      encoding: 'utf-8',
      files: [
        { fileName: 'test1.pdf', contents: mockFile },
        { fileName: 'test2.pdf', contents: mockFile2 }
      ]
    })

    const filesEntries = formData.getAll('files')
    expect(filesEntries).toHaveLength(2)
    expect(filesEntries[0]).toBeInstanceOf(File)
    expect(filesEntries[1]).toBeInstanceOf(File)
  })

  test('should handle undefined files array', () => {
    const formData = buildForm({
      apiUrl: new URL('https://example.com'),
      apiKey: 'test-key',
      format: 'json',
      model: 'text',
      encoding: 'utf-8'
    })

    expect(formData.get('files')).toBeNull()
  })
})
