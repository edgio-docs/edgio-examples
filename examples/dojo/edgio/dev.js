const { createDevServer } = require('@edgio/core/dev')

module.exports = function () {
  return createDevServer({
    label: '[Dojo]',
    command: (port) => `npx dojo build --mode dev --watch --serve --port ${port}`,
    ready: [/output at:/i],
  })
}
