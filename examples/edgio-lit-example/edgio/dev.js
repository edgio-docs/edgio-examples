const { createDevServer } = require('@edgio/core/dev')

module.exports = function () {
  return createDevServer({
    label: '[Lit 2.0]',
    command: (port) => `PORT=${port} NODE_ENV=development npx rollup -c -w && npx tailwindcss -w -i ./src/app.css -o build/app.css`,
    ready: [/listening on/i],
  })
}
