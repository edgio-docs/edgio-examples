import Index from '../views/Index.vue'
import AboutView from '../views/AboutView.vue'
import ProductView from '../views/ProductView.vue'
import CommerceView from '../views/CommerceView.vue'
import { createRouter, createWebHistory } from 'vue-router'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: Index },
    { path: '/about', name: 'about', component: AboutView },
    { path: '/commerce', name: 'commerce', component: CommerceView },
    { path: '/commerce/:slug', name: 'commerceGroup', component: CommerceView },
    { path: '/product/:slug', name: 'product', component: ProductView },
  ],
})
