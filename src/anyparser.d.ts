export type { OcrPresetType, OcrLanguageType } from './config/hardcoded'
export type AnyparserFormatType = 'json' | 'markdown' | 'html'
export type AnyparserModelType = 'text' | 'ocr' | 'vlm' | 'lam' | 'crawler'
export type AnyparserEncodingType = 'utf-8' | 'latin1'

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

export interface AnyparserParsedOption {
  apiUrl: URL
  apiKey: string
  files?: any // eslint-disable-line @typescript-eslint/no-explicit-any
  format: AnyparserFormatType
  model: AnyparserModelType
  encoding: AnyparserEncodingType
  image?: boolean
  table?: boolean
  ocrLanguage?: OcrLanguage[]
  ocrPreset?: OCRPreset
  url?: string
  maxDepth?: number
  maxExecutions?: number
  strategy?: 'LIFO' | 'FIFO'
  traversalScope?: 'subtree' | 'domain'
}

// ---- Parser

export interface AnyparserImageReference {
  base64Data: string
  displayName: string
  page?: number
  imageIndex: number
}

export interface AnyparserResultBase {
  rid: string
  originalFilename: string
  checksum: string
  totalCharacters?: number
  markdown?: string
}

export interface AnyparserCrawlDirectiveBase {
  type: 'HTTP Header' | 'HTML Meta' | 'Combined'
  priority: number
  name?: string
  noindex?: boolean
  nofollow?: boolean
  crawlDelay?: number
  unavailableAfter?: Date
}

export interface AnyparserCrawlDirective extends AnyparserCrawlDirectiveBase {
  type: 'Combined'
  name: undefined
  underlying: AnyparserCrawlDirectiveBase[]
}

export interface AnyparserUrl {
  url: URL
  title?: string
  crawledAt?: string
  statusCode: number
  statusMessage: string
  directive: AnyparserCrawlDirective
  totalCharacters?: number
  markdown?: string
  images?: AnyparserImageReference[]
  text?: string
  politenessDelay: number
}

export interface AnyparserRobotsTxtDirective {
  userAgent: string
  disallow: Set<string>
  allow: Set<string>
  crawlDelay?: number
}

export interface AnyparserPdfPage {
  pageNumber: number
  markdown?: string
  text?: string
  images?: AnyparserImageReference[]
}

export interface AnyparserPdfResult extends AnyparserResultBase {
  totalItems?: number
  items?: AnyparserPdfPage[]
}

export interface AnyparserCrawlResult {
  rid: string
  startUrl: URL
  totalCharacters: number
  totalItems: number
  markdown: string
  items?: AnyparserUrl[]
  robotsDirective: AnyparserRobotsTxtDirective
}

export type AnyparserResult = AnyparserCrawlResult | AnyparserPdfResult | AnyparserResultBase
export type Result = AnyparserResult[] | string
