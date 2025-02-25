import { isNullOrUndefined } from './nullable.ts'

const env = (key: string, fallback = '') => {
  const value = process.env[key]

  if (!isNullOrUndefined(value)) {
    return value
  }

  if (!isNullOrUndefined(fallback)) {
    return fallback
  }

  return ''
}

const envOr = (key: string, fallback = '') => {
  const value = process.env[key] as string

  if (isNullOrUndefined(value)) {
    return fallback
  }

  return ''
}

export { env, envOr }
