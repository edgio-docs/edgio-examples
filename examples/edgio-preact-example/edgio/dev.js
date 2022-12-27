const { createDevServer } = require('@edgio/core/dev')

module.exports = function () {
  return createDevServer({
    label: '[Preact]',
    command: (port) => `npx preact watch --port ${port}`,
    ready: [/On Your Network:/i],
  })
}
