/* istanbul ignore file */
const { createServer } = require('http')
const { join } = require('path')

module.exports = function prod (port) {
  const server = require(join(process.cwd(), 'dist-layer0-server', 'server.js')).default
  return new Promise(resolve => createServer(server).listen(port, resolve))
}
