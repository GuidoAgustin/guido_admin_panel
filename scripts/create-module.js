/* eslint-disable no-undef */
const fs = require('fs')
const parseTemplate = require('./utils/template-parser.js')
const { getFile, createFile } = require('./utils/folders.js')

module.exports = function createModule(nameVariants, { selector, menu }) {
  createTableView(nameVariants)
  createFormModal(nameVariants)

  if (selector) createSelector(nameVariants)
  if (menu) createMenu(nameVariants)
}

function createTableView(nameVariants) {
  const template = parseTemplate(nameVariants, '../templates/view_table.txt')

  createFile(`../../src/views/Dashboard/${nameVariants.pluralPC}.vue`, template)

  console.log(`Table view created in /src/views/Dashboard/${nameVariants.pluralPC}.vue`)
}

function createFormModal(nameVariants) {
  const template = parseTemplate(nameVariants, '../templates/view_form_modal.txt')

  createFile(`../../src/views/Dashboard/${nameVariants.pluralPC}Form.vue`, template)

  console.log(`Form view created in /src/views/Dashboard/${nameVariants.pluralPC}Form.vue`)
}

function createSelector(nameVariants) {
  const template = parseTemplate(nameVariants, '../templates/component_form_select.txt')

  createFile(`../../src/components/Selects/${nameVariants.singularPC}Select.vue`, template)

  console.log(`Selector created in /src/components/Selects/${nameVariants.singularPC}Select.vue`)

  injectSelector(nameVariants)
}

function injectSelector({ singularPC, singularCC }) {
  // Inject into selectModules file
  const relPath = getFile('../../src/components/Selects/_select-modules.js')

  const fileLines = fs.readFileSync(relPath).toString().split('\n')
  let lineToAppendImport
  let lineToAppendExport

  fileLines.forEach((line, index) => {
    if (line.slice(0, 16) === 'export default {') {
      lineToAppendImport = index - 1
      lineToAppendExport = index + 2
    }
  })

  // Import new Selector
  fileLines.splice(
    lineToAppendImport,
    0,
    `import ${singularPC}Select from './${singularPC}Select.vue';`
  )

  // Export new Selector
  fileLines.splice(lineToAppendExport, 0, `  ${singularCC}: ${singularPC}Select,`)

  fs.writeFile(relPath, fileLines.join('\n'), (err) => {
    if (err) throw err
    else {
      console.log('Selector injected in /src/components/Selects/_select-modules.js')
    }
  })
}

function createMenu(nameVariants) {
  const relPath = getFile('../../src/router/menus.js')
  const template = parseTemplate(nameVariants, '../templates/menu.txt')

  const fileLines = fs.readFileSync(relPath).toString().split('\n')
  let lineToAppendImport

  fileLines.forEach((line, index) => {
    if (line.slice(0, 1) === ']') {
      lineToAppendImport = index
    }
  })

  // create new menu
  fileLines[lineToAppendImport - 1] = fileLines[lineToAppendImport - 1] + ','
  fileLines.splice(lineToAppendImport, 0, template)

  fs.writeFile(relPath, fileLines.join('\n'), (err) => {
    if (err) throw err
    else {
      console.log('Menu added in /src/router/menus.js')
    }
  })
}
