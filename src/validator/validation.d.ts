export interface ValidPathValidationResult {
  valid: true
  files: string[]
}

export interface InvalidPathValidationResult {
  valid: false
  error: Error
}

export type PathValidationResult = ValidPathValidationResult | InvalidPathValidationResult
