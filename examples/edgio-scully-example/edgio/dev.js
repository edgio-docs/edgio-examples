const { createDevServer } = require('@edgio/core/dev')

module.exports = function () {
  return createDevServer({
    label: '[Scully]',
    command: (port) => `npx ng serve -- --port ${port}`,
    ready: [/listening on/i],
  })
}
