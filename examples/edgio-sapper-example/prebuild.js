const fs = require('fs')

const BUILD_ID = new Date().getTime()
fs.writeFileSync('BUILD_ID.js', `export const BUILD_ID=${String(BUILD_ID)}`)
