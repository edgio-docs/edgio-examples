module.exports = {
  presets: [['@babel/preset-env']],
  plugins: ['@babel/plugin-syntax-dynamic-import'],
  env: {
    test: {
      plugins: ['transform-es2015-modules-commonjs', 'babel-plugin-dynamic-import-node'],
      ignore: [/node_modules\/(?!lodash-es|@vue\/test-utils)/],
    },
  },
}
