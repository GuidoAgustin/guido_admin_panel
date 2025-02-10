/* eslint-disable no-undef */
const fs = require('fs')
const path = require('path')

exports.checkFolder = function (relPath) {
  const folder = path.resolve(__dirname, relPath)

  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder)
  }

  return folder
}

exports.createFile = function (relPath, content) {
  const fullPath = path.resolve(__dirname, relPath)
  if (fs.existsSync(fullPath)) {
    throw new Error(`There is already a file in path: ${fullPath}`)
  }

  fs.writeFileSync(fullPath, content)
}

exports.getFile = function (relPath) {
  const fullPath = path.resolve(__dirname, relPath)

  if (!fs.existsSync(fullPath)) {
    throw new Error(`There is no file in path: ${fullPath}`)
  }

  return fullPath
}
