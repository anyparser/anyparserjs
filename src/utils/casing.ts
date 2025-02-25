export const toUnderscore = (x = '') => x.trim().split(/\.?(?=[A-Z])/).join('_').toLowerCase()

export const hyphenToCamel = (x: string) => x.replace(/-+(.)/g, (_, c) => c.toUpperCase())

export const underscoreToCamel = (x: string) => x.replace(/_+(.)/g, (_, c) => c.toUpperCase())

export const camelToTitle = (c: string) => c
// Insert space before capital letters, but not if they're part of an acronym
  .replace(/([^A-Z])([A-Z])/g, '$1$2')
// Capitalize first letter
  .replace(/^./, match => match.toUpperCase())
// Remove any extra spaces
  .replace(/\s+/g, '')
