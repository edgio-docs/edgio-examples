const { createDevServer } = require('@edgio/core/dev')

module.exports = function () {
  return createDevServer({
    label: '[Brunch]',
    command: (port) => `npx brunch watch --server --port ${port}`,
    ready: [/output at:/i],
  })
}
