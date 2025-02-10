/* eslint-disable no-undef */
const fs = require('fs')
const path = require('path')

module.exports = function parseTemplate(nameVariants, relPath) {
  const template = fs.readFileSync(path.resolve(__dirname, relPath), 'utf-8')

  let parsedTemplate = template
  Object.keys(nameVariants).forEach((key) => {
    parsedTemplate = parsedTemplate.replaceAll(`{{${key}}}`, nameVariants[key])
  })

  return parsedTemplate
}
