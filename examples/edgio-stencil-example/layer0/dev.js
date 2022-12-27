const { createDevServer } = require('@layer0/core/dev')

module.exports = function () {
  return createDevServer({
    label: '[Stencil]',
    command: (port) => `npx stencil build --dev --watch --serve --no-open --port ${port}`,
    ready: [/localhost:/i],
  })
}
