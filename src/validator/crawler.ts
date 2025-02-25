import { isNullOrUndefined } from '@src/utils/nullable.ts'

export const getURLToCrawl = (filePaths: string | string[]) => {
  if (Array.isArray(filePaths)) {
    const filePath = filePaths.find(x => !isNullOrUndefined(x))

    if (!isNullOrUndefined(filePath)) {
      return new URL(filePath).toString()
    }
  }

  return new URL(filePaths).toString()
}
