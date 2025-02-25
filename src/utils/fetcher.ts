export class WrappedError extends Error {
  override cause: Error
  statusCode: number

  constructor (message: string, cause: Error, statusCode: number) {
    super(message)
    this.name = 'WrappedError'
    this.cause = cause
    this.statusCode = statusCode
  }
}

export const wrappedFetch = async (input: string | URL | Request, options?: RequestInit) => {
  const response = await fetch(input, options)

  if (!response.ok) {
    const { status, statusText } = response
    const text = await response.text()

    throw new WrappedError(
      `HTTP ${status} ${statusText}: ${input}`,
      new Error(text),
      status
    )
  }

  return response
}
