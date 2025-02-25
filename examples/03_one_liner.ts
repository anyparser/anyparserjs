import { Anyparser } from '@anyparser/core'

async function main () {
  console.log(await new Anyparser().parse('docs/sample.docx'))
}

main().catch(console.error)
