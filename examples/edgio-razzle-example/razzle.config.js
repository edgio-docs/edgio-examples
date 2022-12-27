const { InjectManifest } = require('workbox-webpack-plugin')

module.exports = {
  modifyWebpackConfig({
    env: { target, dev },
    webpackConfig,
    webpackObject,
    options: { razzleOptions, webpackOptions },
    paths,
  }) {
    const appConfig = Object.assign({}, webpackConfig)
    if (target === 'web') {
      appConfig.plugins.push(
        new InjectManifest({ swDest: './service-worker.js', swSrc: './service-worker.js' })
      )
    }
    return appConfig
  },
}
