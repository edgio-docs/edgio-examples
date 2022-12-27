<template>
  <Page>
    <div class="flex-col items-center justify-start">
      <div class="flex w-full flex-row items-start px-5">
        <div class="pt-5 flex flex-col min-w-[200px]">
          <sidebar />
        </div>
        <div class="flex flex-col items-start pt-5">
          <h2 class="text-[#FFFFFF75]">Showing {{ items ? items.length : '...' }} Results</h2>
          <div class="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            <Prefetch :key="item.path" v-for="item in items || fallbackData" :url="`/l0-api/products/${item.slug}`">
              <a :href="`/product/${item.slug}.html`" class="relative mt-2 border border-white p-1">
                <div class="absolute top-0 left-0 z-10 flex flex-col items-start">
                  <h3 class="border border-gray-200 bg-white py-1 px-2 text-xs md:py-2 md:px-4 md:text-xl font-medium text-black">{{ item.name }}</h3>
                  <h4 class="border border-gray-200 bg-white py-1 px-2 text-xs md:py-2 md:px-4 md:text-lg text-black">
                    {{ item.prices.price.value }}{{ item.prices.price.currencyCode }}
                  </h4>
                </div>
                <img
                  width="1200"
                  height="1200"
                  loading="lazy"
                  v-if="item.images"
                  :src="getImage(item.images[0].url)"
                  class="h-full object-contain bg-white"
                />
                <div v-if="!item.images" class="h-full w-full bg-white/50 animate-pulse min-h-[100px] min-w-[100px]"></div>
              </a>
            </Prefetch>
          </div>
        </div>
      </div>
    </div>
  </Page>
</template>

<script>
import Page from '@/layouts/page.vue'
import Prefetch from '@layer0/vue/Prefetch'
import Sidebar from '@/components/Sidebar.vue'
import { filterProducts, relativizeURL } from '@/lib/helper'

export default {
  layout: 'page',
  components: { Sidebar, Page, Prefetch },
  name: 'Commerce',
  data: () => {
    return {
      items: [],
      slug: undefined,
      filter: undefined,
      fallbackData: new Array(12).fill(0).map((_, _ind) => ({
        name: '',
        slug: '',
        path: `/${_ind}`,
        prices: { price: { value: '', currencyCode: '' } },
      })),
    }
  },
  watch: {
    '$route.query.filter': {
      handler: function (filter) {
        this.setProducts(this.slug, filter)
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    getImage: (url) => relativizeURL(url),
    setProducts(slug, query) {
      if (typeof window !== 'undefined') {
        let link = window.location.origin
        if (slug) {
          fetch(`${link}/l0-api/categories/${slug}`)
            .then((res) => res.json())
            .then((res) => {
              this.items = filterProducts(res['items'], query)
            })
        } else {
          fetch(`${link}/l0-api/products/all`)
            .then((res) => res.json())
            .then((res) => {
              this.items = filterProducts(res, query)
            })
        }
      }
    },
  },
  mounted() {
    let temp = window.location.pathname.replace('/commerce.html', '').replace('/commerce/', '').replace('.html', '')
    if (window.location.pathname.includes('/commerce') && temp.length > 0) {
      this.slug = temp
    }
    this.filter = new URLSearchParams(new URL(window.location.href).search.substring(1)).get('filter')
    this.setProducts(this.slug, this.filter)
  },
}
</script>