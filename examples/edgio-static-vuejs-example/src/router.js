import Index from './components/Index.vue'
import About from './components/About.vue'
import Product from './components/Product.vue'
import Commerce from './components/Commerce.vue'
import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Index },
    { path: '/about', component: About },
    { path: '/commerce', component: Commerce },
    { path: '/product/:slug', component: Product },
    { path: '/commerce/:slug', component: Commerce },
  ],
})
