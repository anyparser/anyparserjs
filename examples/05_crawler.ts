import type { AnyparserCrawlResult, AnyparserOption, AnyparserUrl } from '@anyparser/core'
import { Anyparser } from '@anyparser/core'

const url = 'https://anyparser.com/docs'

const options: AnyparserOption = {
  apiUrl: new URL(process.env.ANYPARSER_API_URL ?? 'https://anyparserapi.com'),
  apiKey: process.env.ANYPARSER_API_KEY,
  model: 'crawler',
  format: 'json',
  maxDepth: 50,
  maxExecutions: 2,
  strategy: 'LIFO',
  traversalScope: 'subtree'
}

const parser = new Anyparser(options)

async function main () {
  const result = await parser.parse(url) as AnyparserCrawlResult[]

  for (const candidate of result) {
    console.log('\n')
    console.log('Start URL            :', candidate.startUrl)
    console.log('Total characters     :', candidate.totalCharacters)
    console.log('Total items          :', candidate.totalItems)
    console.log('Robots directive     :', candidate.robotsDirective)
    console.log('\n')
    console.log('*'.repeat(100))
    console.log('Begin Crawl')
    console.log('*'.repeat(100))
    console.log('\n')

    const resources = candidate.items || []

    for (let index = 0; index < resources.length; index++) {
      const item = resources[index] as AnyparserUrl

      if (index > 0) {
        console.log('-'.repeat(100))
        console.log('\n')
      }

      console.log('URL                  :', item.url)
      console.log('Title                :', item.title)
      console.log('Status message       :', item.statusMessage)
      console.log('Total characters     :', item.totalCharacters)
      console.log('Politeness delay     :', item.politenessDelay)
      console.log('Content:\n')
      console.log(item.markdown)
    }
  }
}

main().catch(console.error)
