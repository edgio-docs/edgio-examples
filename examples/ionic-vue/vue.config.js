const { InjectManifest } = require('workbox-webpack-plugin')

const config = {} // Initialize unconditional config

if (process.env.NODE_ENV === 'production') {
  config['configureWebpack'] = {
    plugins: [
      new InjectManifest({
        swSrc: './service-worker.js',
      }),
    ],
  }
}

module.exports = config
