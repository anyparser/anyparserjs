import type { AnyparserOption } from '@anyparser/core'
import { Anyparser, OCR_LANGUAGES } from '@anyparser/core'

const singleFile = 'docs/document.png'

const options: AnyparserOption = {
  apiUrl: new URL(process.env.ANYPARSER_API_URL ?? 'https://anyparserapi.com'),
  apiKey: process.env.ANYPARSER_API_KEY,
  model: 'ocr',
  format: 'markdown',
  // ocrLanguage: ['eng'],
  ocrLanguage: [OCR_LANGUAGES.JAPANESE],
  ocrPreset: 'scan'
}

const parser = new Anyparser(options)

async function main () {
  const result = await parser.parse(singleFile)
  console.log(result)
}

main().catch(console.error)
