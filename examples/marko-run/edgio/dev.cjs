const { createDevServer } = require('@edgio/core/dev')

module.exports = () => {
  return createDevServer({
    label: 'Marko Run',
    command: (port) => `npm run dev --port ${port}`,
    ready: [/localhost:/i],
  })
}
