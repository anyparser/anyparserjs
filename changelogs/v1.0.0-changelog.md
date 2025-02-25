# Anyparser Core: Your Foundation for AI Data Preparation

https://anyparser.com

**Unlock the potential of your AI models with Anyparser Core, the Typescript SDK designed for high-performance content extraction and format conversion.**  Built for developers, this SDK streamlines the process of acquiring clean, structured data from diverse sources, making it an indispensable tool for building cutting-edge applications in **Retrieval Augmented Generation (RAG)**, **Agentic AI**, **Generative AI**, and robust **ETL Pipelines**.

**Key Benefits for AI Developers:**

* **Rapid Data Acquisition for RAG:** Extract information up to 10x faster than traditional methods, accelerating the creation of your knowledge bases for efficient RAG implementations.
* **High-Accuracy Data for Generative AI:** Achieve up to 10x improvement in extraction accuracy, ensuring your Generative AI models are trained and operate on reliable, high-quality data. Output in JSON or Markdown is directly consumable by AI processes.
* **Cost-Effective Knowledge Base Construction:**  Efficiently build and maintain knowledge bases from unstructured data, significantly reducing the overhead for RAG, Agentic AI, and other AI applications.
* **Developer-First Design:** Unlimited local usage (fair use policies apply) allows for rapid experimentation and seamless integration into your existing AI workflows.
* **Optimized for ETL Pipelines:**  Provides a robust extraction layer for your ETL processes, handling a wide variety of file types and URLs to feed your data lakes and AI systems.

**Get Started Quickly:**

1. **Free Access:** Obtain your API credentials and start building your AI data pipelines today at [Anyparser Studio](https://studio.anyparser.com/).
2. **Installation:** Install the SDK with a simple `npm install` command.
3. **Run Examples:**  Copy and paste the provided examples to see how easy it is to extract data for your AI projects.

Before starting, add a new API key on the [Anyparser Studio](https://studio.anyparser.com/).


```bash
export ANYPARSER_API_URL=https://anyparserapi.com
export ANYPARSER_API_KEY=<your-api-key>
```

or

```bash
export ANYPARSER_API_URL=https://eu.anyparserapi.com
export ANYPARSER_API_KEY=<your-api-key>
```

## Installation

```bash
npm install @anyparser/core
```

## Core Usage Examples for AI Applications

These examples demonstrate how to use `Anyparser Core` for common AI tasks, arranged from basic to advanced usage.


### Example 1: Quick Start with Single Document

When you're just getting started or prototyping, you can use this simplified approach with minimal configuration:

```typescript
import { Anyparser } from '@anyparser/core'

async function main () {
  // Instantiate with default settings, assuming API credentials are
  // set as environment variables.
  console.log(await new Anyparser().parse('docs/sample.docx'))
}

main().catch(console.error)
```

### Example 2: Building a RAG Knowledge Base from Local Documents

This example showcases how to extract structured data from local files with full configuration, preparing them for indexing in a RAG system. The JSON output is ideal for vector databases and downstream AI processing. Perfect for building your initial knowledge base with high-quality, structured data.

```typescript
import type { AnyparserOption, AnyparserResultBase } from '@anyparser/core'
import { Anyparser } from '@anyparser/core'

const multipleFiles = ['docs/sample.docx', 'docs/sample.pdf']

const options: AnyparserOption = {
  apiUrl: new URL(process.env.ANYPARSER_API_URL ?? 'https://anyparserapi.com'),
  apiKey: process.env.ANYPARSER_API_KEY,
  format: 'json',
  image: true,
  table: true
}

const parser = new Anyparser(options)

async function main () {
  const result = await parser.parse(multipleFiles) as AnyparserResultBase[]

  for (const item of result) {
    console.log('-'.repeat(100))
    console.log('File:', item.originalFilename)
    console.log('Checksum:', item.checksum)
    console.log('Total characters:', item.totalCharacters)
    console.log('Markdown:', item.markdown?.substring(0, 500))
  }

  console.log('-'.repeat(100))
}

main().catch(console.error)
```

### Example 3: OCR Processing for Image-Based Documents

Extract text from images and scanned documents using our advanced OCR capabilities. This example shows how to configure language and preset options for optimal results, particularly useful for processing historical documents, receipts, or any image-based content:

```typescript
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
```

### Example 4: Web Crawling for Dynamic Knowledge Base Updates

Keep your knowledge base fresh with our powerful web crawling capabilities. This example shows how to crawl websites while respecting robots.txt directives and maintaining politeness delays:

```typescript
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
```

## Configuration for Optimized AI Workloads

The `Anyparser` class defines the `AnyparserOption` interface for flexible configuration, allowing you to fine-tune the extraction process for different AI use cases.

```typescript
export interface AnyparserOption {
  apiUrl?: URL
  apiKey?: string
  format?: AnyparserFormatType
  model?: AnyparserModelType
  encoding?: AnyparserEncodingType
  image?: boolean
  table?: boolean
  files?: string | string[]
  ocrLanguage?: OcrLanguageType[]
  ocrPreset?: OcrPresetType
  url?: string
  maxDepth?: number
  maxExecutions?: number
  strategy?: 'LIFO' | 'FIFO'
  traversalScope?: 'subtree' | 'domain'
}
```

**Key Configuration Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `apiUrl` | `string (optional)` | `undefined` | API endpoint URL. Defaults to `ANYPARSER_API_URL` environment variable |
| `apiKey` | `string (optional)` | `undefined` | API key for authentication. Defaults to `ANYPARSER_API_KEY` environment variable |
| `format` | `str` | `"json"` | Output format: `"json"`, `"markdown"`, or `"html"` |
| `model` | `str` | `"text"` | Processing model: `"text"`, `"ocr"`, `"vlm"`, `"lam"`, or `"crawler"` |
| `encoding` | `str` | `"utf-8"` | Text encoding: `"utf-8"` or `"latin1"` |
| `image` | `boolean (optional)` | `undefined` | Enable/disable image extraction |
| `table` | `boolean (optional)` | `undefined` | Enable/disable table extraction |
| `files` | `string or string[] (optional)` | `undefined` | Input files to process |
| `url` | `string (optional)` | `undefined` | URL for crawler model |
| `ocrLanguage` | `OcrLanguageType[] (optional)` | `undefined` | Languages for OCR processing |
| `ocrPreset` | `OcrPresetType (optional)` | `undefined` | Preset configuration for OCR |
| `maxDepth` | `number (optional)` | `undefined` | Maximum crawl depth for crawler model |
| `maxExecutions` | `number (optional)` | `undefined` | Maximum number of pages to crawl |
| `strategy` | `string (optional)` | `undefined` | Crawling strategy: `"LIFO"` or `"FIFO"` |
| `traversalScope` | `string (optional)` | `undefined` | Crawling scope: `"subtree"` or `"domain"` |

**OCR Presets:**

The following OCR presets are available for optimized document processing:

- `OCRPreset.DOCUMENT` - General document processing
- `OCRPreset.HANDWRITING` - Handwritten text recognition
- `OCRPreset.SCAN` - Scanned document processing
- `OCRPreset.RECEIPT` - Receipt processing
- `OCRPreset.MAGAZINE` - Magazine/article processing
- `OCRPreset.INVOICE` - Invoice processing
- `OCRPreset.BUSINESS_CARD` - Business card processing
- `OCRPreset.PASSPORT` - Passport document processing
- `OCRPreset.DRIVER_LICENSE` - Driver's license processing
- `OCRPreset.IDENTITY_CARD` - ID card processing
- `OCRPreset.LICENSE_PLATE` - License plate recognition
- `OCRPreset.MEDICAL_REPORT` - Medical document processing
- `OCRPreset.BANK_STATEMENT` - Bank statement processing

**OCR Language:**

[List of OCR Languages](https://github.com/anyparser/anyparserjs/blob/master/src/config/hardcoded.ts#L20-L150)


**Model Types for AI Data Pipelines:**

Select the appropriate processing model based on your AI application needs:

* `'text'`:  Optimized for extracting textual content for language models and general text-based RAG.
* `'ocr'`:  Performs Optical Character Recognition to extract text from image-based documents, expanding your data sources for AI training and knowledge bases. **Essential for processing scanned documents for RAG and Generative AI.**
* `'vlm'`:  Utilizes a Vision-Language Model for advanced understanding of image content, enabling richer context for Generative AI and more sophisticated Agentic AI perception.
* `'lam'` (Coming Soon): Employs a Large-Audio Model for extracting insights from audio data, opening new possibilities for multimodal AI applications.
* `'crawler'`: Enables website crawling to gather up-to-date information for dynamic AI knowledge bases and Agentic AI agents.

**OCR Configuration for Enhanced AI Data Quality (when `model='ocr'`):**

Fine-tune OCR settings for optimal accuracy when processing image-based documents. This is critical for ensuring high-quality data for your AI models.

| Option         | Type              | Default | Description                                                                                                 | Relevance for AI                                                                             |
|----------------|-------------------|---------|-------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------|
| `ocrLanguage` | `OcrLanguageType[] (optional)` | `undefined`  | List of ISO 639-2 language codes for OCR, ensuring accurate text extraction for multilingual documents.      | **Essential for accurate data extraction from documents in different languages for global AI.** |
| `ocrPreset`   | `string (optional)`   | `undefined`  | Predefined configuration for specific document types to optimize OCR accuracy.                               | **Use presets to improve accuracy for specific document types used in your AI workflows.**    |

**Available OCR Presets for AI Data Preparation:**

Leverage these presets for common document types used in AI datasets:

* `'document'`:  General-purpose OCR for standard documents.
* `'handwriting'`: Optimized for handwritten text, useful for digitizing historical documents or notes for AI analysis.
* `'scan'`:  For scanned documents and images.
* **Specific Document Presets (valuable for structured data extraction):** `'receipt'`, `'magazine'`, `'invoice'`, `'business-card'`, `'passport'`, `'driver-license'`, `'identity-card'`, `'license-plate'`, `'medical-report'`, `'bank-statement'`. **These presets are crucial for building structured datasets for training specialized AI models or powering Agentic AI agents that interact with these document types.**


## Contributing to AI-Ready Data Extraction

We welcome contributions to the `Anyparser Core` SDK, particularly those that enhance its capabilities for AI data preparation. Please refer to the [Contribution Guidelines](CONTRIBUTING.md).

# Frequently Asked Questions (FAQ)

1. **Do I have to buy a license to use the SDK?**
    - No, there's no need to buy a license to use the SDK. You can get started right away.
2. **Do you store my documents?**
    - No, we do not store any of your documents. All data is processed in real-time and discarded after the task is completed.
3. **Is there a way to test the software or have a free trial?**
    - You don't need to commit. You can use the API on your developer machine for free with a fair usage policy. OCR and VLM models are not free, but you can purchase a tiny (as low as $5) credit to test the quality of the output.
4. **Can I get a refund?**
    - No, we do not offer any refunds.
5. **Is Anyparser Available in My Region?**
    - Currently, Anyparser is only available in the EU, US, and a few other countries. We are working on expanding to more regions.
6. **Why don't you have paid plans?**
    - We use a pay-per-use model to offer [flexible pricing](https://anyparser.com/pricing) and avoid locking customers into expensive subscriptions.
7. **Does the license allow me to use the software in a SaaS product?**
    - Yes, the license permits usage in SaaS products.
8. **What kind of support will I get?**
    - We offer email and ticket-based support.
9. **Does the SDK support chunking and embedding?**
    - No, our service focuses on the extraction layer in your ETL pipeline. Chunking and embedding would be handled separately by your own system.
10. **Does the SDK support multiple file uploads?**
    - Yes.
11. **Does it support converting receipts to structured output?**
    - Yes, Anyparser can extract data from receipts and convert it into structured formats.
12. **Does it support multiple languages?**
    - Yes, Anyparser supports multiple languages for text extraction.
13. **Where are your servers located?**
    - Our servers are located in the US with a federated setup across United States, Europe, and Asia. We are adding more regions as we move forward.

### Why Use Anyparser SDKs?

- **100% Free for Developers**: As long as you're running Anyparser on your local laptop or personal machine (not on servers), unlimited extraction is completely free under our fair usage policy. There’s no need to pay for anything, making it perfect for developers testing and building on their development environment.
- **Speed**: Up to 10x faster than traditional parsing tools, with optimized processing for both small and large documents.
- **Accuracy**: Get highly accurate, structured outputs even from complex formats like OCR, tables, and charts.
- **Scalability**: Whether you're processing a few documents or millions, our SDKs ensure smooth integration with your workflows.
- **Multiple File Support**: Effortlessly parse bulk files, saving time and optimizing batch processing.
- **Zero Learning Curve**: The SDKs come with comprehensive examples, documentation, and minimal setup, allowing you to get started immediately without needing deep technical expertise.

# Product Roadmap

While Anyparser is already a powerful solution for document parsing, we’re committed to continually improving and expanding our platform. Our roadmap includes:

- **Further Integrations**: We plan to add more integrations with industry-standard tools and platforms, enabling deeper workflows and expanding compatibility.
- **Additional Models**: We aim to introduce new parsing models to handle more complex or specialized data extraction tasks.
- **Enhanced Features**: Continuous improvement of our existing features, such as support for additional file formats, optimization of processing speed, and improved accuracy.


## License

Apache-2.0

## Support for AI Developers

For technical support or inquiries related to using Anyparser Core for AI applications, please visit our [Community Discussions](https://github.com/anyparser/anyparser_core/discussions). We are here to help you build the next generation of AI applications.

