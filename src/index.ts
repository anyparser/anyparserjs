/**
 * Anyparser main entry point
 * @module anyparser
 */

export * from './parser.ts'

export { OCR_LANGUAGES, OCR_PRESETS } from './config/hardcoded.ts'

export type { OcrLanguageType, OcrPresetType, AnyparserOption, AnyparserImageReference, AnyparserResultBase, AnyparserCrawlDirectiveBase, AnyparserCrawlDirective, AnyparserUrl, AnyparserRobotsTxtDirective, AnyparserPdfPage, AnyparserPdfResult, AnyparserCrawlResult, AnyparserResult, Result } from './anyparser.d.ts'
