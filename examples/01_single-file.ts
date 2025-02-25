import type { AnyparserOption, AnyparserResultBase } from '@anyparser/core'
import { Anyparser } from '@anyparser/core'

const singleFile = 'docs/sample.docx'

const options: AnyparserOption = {
  apiUrl: new URL(process.env.ANYPARSER_API_URL ?? 'https://anyparserapi.com'),
  apiKey: process.env.ANYPARSER_API_KEY,
  format: 'json',
  image: true,
  table: true
}

const parser = new Anyparser(options)

async function main () {
  const result = await parser.parse(singleFile) as AnyparserResultBase[]

  for (const item of result) {
    console.log('-'.repeat(100))
    console.log('File:', item.originalFilename)
    console.log('Checksum:', item.checksum)
    console.log('Total characters:', item.totalCharacters)
    console.log('Markdown:', item.markdown)
  }

  console.log('-'.repeat(100))
}

main().catch(console.error)
