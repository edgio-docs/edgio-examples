const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: {
    browser: './layer0/browser.js',
    'service-worker': './layer0/service-worker.js',
  },
  mode: 'production',
  resolve: {
    extensions: ['.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../dist-layer0-client'),
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.DEBUG_SW': JSON.stringify(process.env.DEBUG_SW || false),
    }),
  ],
}
