/* eslint-disable no-undef */
const fs = require('fs')
const parseTemplate = require('./utils/template-parser.js')
const { checkFolder, createFile, getFile } = require('./utils/folders.js')

module.exports = function createStore(nameVariants) {
  createStoreFile(nameVariants)
  injectStore(nameVariants)
}

function createStoreFile(nameVariants) {
  const template = parseTemplate(nameVariants, '../templates/store.txt')

  checkFolder(`../../src/store`)
  createFile(`../../src/store/_${nameVariants.pluralSC}.js`, template)

  console.log(`Store created in /src/store/_${nameVariants.pluralSC}.js`)
}

function injectStore({ pluralSC }) {
  const relPath = getFile('../../src/store/index.js')

  const fileLines = fs.readFileSync(relPath).toString().split('\n')
  let lineToAppendImport
  let lineToAppendExport

  fileLines.forEach((line, index) => {
    if (line.slice(0, 28) === 'export default createStore({') lineToAppendImport = index - 1
    if (line.slice(0, 12) === '  modules: {') lineToAppendExport = index + 2
  })

  // Import new Store
  fileLines.splice(lineToAppendImport, 0, `import ${pluralSC} from './${pluralSC}';`)

  // Export new Store
  fileLines.splice(lineToAppendExport, 0, `    ${pluralSC},`)

  fs.writeFile(relPath, fileLines.join('\n'), (err) => {
    if (err) throw err
    else {
      console.log('Store injected in /src/store/index.js')
    }
  })
}
