/* eslint-disable no-undef */
const normalizeName = (name) =>
  name.replace(/\.?([A-Z]+)/g, (x, y) => `_${y.toLowerCase()}`).replace(/^_/, '')

const nameToPlural = (name) => {
  const lastChar = name.slice(-1)

  if (lastChar === 'y') return `${name.slice(0, name.length - 1)}ies`
  if (lastChar === 's') return `${name}es`

  return `${name}s`
}

const nameToCamelCase = (pluralName) =>
  pluralName
    .split('_')
    .map((x, i) => (i === 0 ? x : `${x[0].toUpperCase()}${x.slice(1)}`))
    .join('')

const nameToPascalCase = (pluralName) =>
  pluralName
    .split('_')
    .map((x) => `${x[0].toUpperCase()}${x.slice(1)}`)
    .join('')

module.exports = function parseName(name) {
  const normalized = normalizeName(name)
  const nameVariants = {
    singularSC: normalized,
    singularUSC: normalized.toUpperCase(),
    singularCC: nameToCamelCase(normalized),
    singularPC: nameToPascalCase(normalized),
    singularPCSpaced: nameToPascalCase(normalized)
      .replace(/([A-Z])/g, ' $1')
      .trim(),
    pluralSC: nameToPlural(normalized),
    pluralUSC: nameToPlural(normalized).toUpperCase(),
    pluralCC: nameToCamelCase(nameToPlural(normalized)),
    pluralPC: nameToPascalCase(nameToPlural(normalized)),
    pluralPCSpaced: nameToPascalCase(nameToPlural(normalized))
      .replace(/([A-Z])/g, ' $1')
      .trim()
  }

  return nameVariants
}
