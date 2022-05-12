const fs = require('fs')
const packageConfig = require ('../../package.json')

function readFile(curPath) {
  const content = fs.readFileSync(curPath,'utf-8')
  return content
}

function getVersion() {
  return packageConfig.version || '1.0.0'
}

function getTestVersion() {
  return packageConfig.testVersion || '1.0.0'
}

function getEnv() {
  return process.env.NODE_ENV || 'dev'
}

module.exports = {
  readFile,
  getVersion,
  getTestVersion,
  getEnv
}