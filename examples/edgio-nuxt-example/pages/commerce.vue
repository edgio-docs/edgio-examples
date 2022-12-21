<template>
  <div class="flex-col items-center justify-start">
    <div class="flex w-full flex-row items-start px-5">
      <div class="pt-5 flex flex-col min-w-[200px]">
        <Sidebar />
      </div>
      <div class="flex flex-col items-start pt-5">
        <h2 class="text-[#FFFFFF75]">Showing {{ data ? data.length : '...' }} Results</h2>
        <div class="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          <Prefetch :key="item.path" v-for="item in data || fallbackData" :url="`/l0-api/products/${item.slug}`">
            <NuxtLink :to="`/product/${item.slug}`" class="relative mt-2 border border-white p-1">
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
            </NuxtLink>
          </Prefetch>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Prefetch } from '@edgio/vue'
import Sidebar from '@/components/Sidebar.vue'
import HeartIcon from '@/components/HeartIcon.vue'
import { relativizeURL, getOrigin, filterProducts } from '@/lib/helper'

export default {
  components: {
    Sidebar,
    Prefetch,
    HeartIcon,
  },
  data: () => {
    return {
      fallbackData: new Array(12).fill(0).map((_, _ind) => ({
        name: '',
        slug: '',
        path: `/${_ind}`,
        prices: { price: { value: '', currencyCode: '' } },
      })),
    }
  },
  methods: {
    getImage: (url) => relativizeURL(url),
    createFilter() {
      if (!this.$route.query || !this.$route.query['filter']) {
        this.$router.push({ path: this.$route.path, query: { filter: 'trending' } })
      }
    },
  },
  watchQuery: (newVal, oldVal) => {
    return newVal.filter !== oldVal.filter
  },
  watch: {
    $route(to, from) {
      this.createFilter()
    },
  },
  mounted() {
    this.createFilter()
  },
  async asyncData({ req, params, query, redirect }) {
    let resp = await fetch(`${getOrigin(req)}/l0-api/${params.name ? `categories/${params.name}` : 'products/all'}`)
    if (!resp.ok) {
      redirect(404, '/error')
    } else {
      let data = await resp.json()
      if (params.name) {
        data = data['items']
      }
      data = filterProducts(data, query.filter)
      return { data }
    }
  },
}
</script>
