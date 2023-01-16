const { join } = require('path')
const { existsSync } = require('fs')
const { createServer } = require('http')

module.exports = async (port) => {
  const appFilePath = join(process.cwd(), '.vercel', 'output', 'functions', 'render.func', '.svelte-kit', 'vercel-tmp', 'index.js')
  if (existsSync(appFilePath)) {
    createServer(await (await import(appFilePath)).default).listen(port)
  }
}
