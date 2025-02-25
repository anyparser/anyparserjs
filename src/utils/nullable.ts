export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type Nullish<T> = Nullable<T> | Optional<T>

const isNullOrUndefined = <T>(suspect: Nullish<T>): suspect is null | undefined => {
  if (typeof suspect === 'undefined' || suspect === null) {
    return true
  }

  if (typeof suspect === 'string') {
    return suspect.trim() === ''
  }

  return false
}

const isValidObject = (suspect: unknown): suspect is object => {
  return typeof suspect === 'object' && suspect !== undefined && suspect !== null
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
const isEmptyObject = (suspect: unknown): suspect is {} => {
  return isValidObject(suspect) && Object.keys(suspect).length === 0
}

const isInvalidOrEmptyArray = <T>(suspect: Nullish<Array<T>>): suspect is null | undefined | [] => {
  if (isNullOrUndefined(suspect)) {
    return true
  }

  if (!Array.isArray(suspect)) {
    throw new Error('isInvalidOrEmptyArray expects an array')
  }

  return suspect.length === 0
}

const isValidArrayWithMembers = <T>(suspect: Nullish<Array<T>>): suspect is Array<T> => !isInvalidOrEmptyArray(suspect)

const or = <T>(value: Nullish<T>, or: T): T => {
  if (isNullOrUndefined(value)) {
    return or
  }

  return value
}

export {
  isInvalidOrEmptyArray,
  isNullOrUndefined,
  isValidArrayWithMembers,
  isValidObject,
  isEmptyObject,
  or
}
