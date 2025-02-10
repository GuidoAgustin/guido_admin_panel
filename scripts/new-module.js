/* eslint-disable no-undef */
const yargs = require('yargs')
const parseName = require('./utils/name-parser.js')
// const createStore = require('./create-store.js')
const createModule = require('./create-module.js')

try {
  const options = yargs
    .usage('Usage: -n <name> [-s|--selector]')
    .option('n', {
      alias: 'name',
      describe: 'Model name',
      type: 'string',
      demandOption: true
    })
    .option('s', {
      alias: 'selector',
      describe: 'Create selector',
      type: 'boolean',
      demandOption: false
    })
    .option('m', {
      alias: 'menu',
      describe: 'Create menu',
      type: 'boolean',
      demandOption: false
    }).argv

  const nameVariants = parseName(options.name)

  // createStore(nameVariants)
  createModule(nameVariants, {
    selector: options.selector,
    menu: options.menu
  })
} catch (error) {
  console.error(error)
}
