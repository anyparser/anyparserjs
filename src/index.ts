/**
 * Anyparser main entry point
 * @module anyparser
 */
import { ANYPARSER_VERSION, version } from './version.ts'
import { OCR_LANGUAGES, OCR_PRESETS } from './config/hardcoded.ts'
import { Anyparser } from './parser.ts'
import type { OcrLanguageType, OcrPresetType, AnyparserOption, AnyparserImageReference, AnyparserResultBase, AnyparserCrawlDirectiveBase, AnyparserCrawlDirective, AnyparserUrl, AnyparserRobotsTxtDirective, AnyparserPdfPage, AnyparserPdfResult, AnyparserCrawlResult, AnyparserResult, Result } from './anyparser.d.ts'

export { version, ANYPARSER_VERSION, OCR_LANGUAGES, OCR_PRESETS, Anyparser }
export type { OcrLanguageType, OcrPresetType, AnyparserOption, AnyparserImageReference, AnyparserResultBase, AnyparserCrawlDirectiveBase, AnyparserCrawlDirective, AnyparserUrl, AnyparserRobotsTxtDirective, AnyparserPdfPage, AnyparserPdfResult, AnyparserCrawlResult, AnyparserResult, Result }
