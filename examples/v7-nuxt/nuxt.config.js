export default {
  head: {
    title: 'edgio-nuxt-example',
    meta: [{ charset: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  },
  components: true,
  css: ['@/assets/css/main.css'],
  buildModules: [['@edgio/nuxt/module', { edgioSourceMaps: true }]],
  build: {
    postcss: {
      postcssOptions: {
        plugins: {
          tailwindcss: {},
          autoprefixer: {},
        },
      },
    },
  },
  router: {
    extendRoutes(routes, resolve) {
      routes.push({
        name: 'Commerce',
        path: '/commerce/:name',
        component: resolve(__dirname, 'pages/commerce.vue'),
      })
    },
  },
}
