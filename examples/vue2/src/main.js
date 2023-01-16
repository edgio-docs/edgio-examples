import Vue from 'vue'
import App from './App.vue'
import './compiled/output.css'
import VueRouter from 'vue-router'

Vue.config.productionTip = false
Vue.use(VueRouter)

import Index from './components/Index.vue'
import About from './components/About.vue'
import Product from './components/Product.vue'
import Commerce from './components/Commerce.vue'

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: Index },
    { path: '/about', component: About },
    { path: '/commerce', component: Commerce },
    { path: '/product/:slug', component: Product },
    { path: '/commerce/:slug', component: Commerce },
  ],
})

new Vue({
  router,
  data: () => ({ n: 0 }),
  render: (h) => h(App),
}).$mount('#app')

import EdgioRUM from '../edgio/rum'
import { install } from '@edgio/prefetch/window'
import installDevtools from '@edgio/devtools/install'

installDevtools()
install({ includeCacheMisses: true })
EdgioRUM('29f61ab4-db8a-4dcc-9412-e1901c6dad61')
