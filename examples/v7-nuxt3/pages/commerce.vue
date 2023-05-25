<template>
  <div class="flex-col items-center justify-start">
    <div class="flex w-full flex-row items-start px-5">
      <div class="pt-5 flex flex-col min-w-[200px]">
        <Sidebar />
      </div>
      <div class="flex flex-col items-start pt-5">
        <h2 class="text-[#FFFFFF75]">Showing {{ finalProducts ? finalProducts.length : '...' }} Results</h2>
        <div class="mt-5 grid grid-cols-1 sm:gird-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          <NuxtLink :key="item.path" :to="`/product/${item.slug}`" v-for="item in finalProducts" class="relative mt-2 border border-white p-1">
            <ClientOnly>
              <prefetch :url="`/edgio-api/products/${item.slug}`"><span class="h-0 w-0"></span></prefetch>
            </ClientOnly>
            <div class="absolute top-0 left-0 z-10 flex flex-col items-start">
              <h3 class="border border-gray-200 bg-white py-1 px-2 text-xs md:py-2 md:px-4 md:text-xl font-medium text-black">
                {{ item ? item.name : '' }}
              </h3>
              <h4 class="border border-gray-200 bg-white py-1 px-2 text-xs md:py-2 md:px-4 md:text-lg text-black">
                {{ item && item.prices ? item.prices.price.value : '' }}{{ item && item.prices ? item.prices.price.currencyCode : '' }}
              </h4>
            </div>
            <img
              width="1200"
              height="1200"
              loading="lazy"
              v-if="item.images"
              :src="relativizeURL(item.images[0].url)"
              class="h-full object-contain bg-white"
            />
            <div v-if="!item.images" class="h-full w-full bg-white/50 animate-pulse min-h-[100px] min-w-[100px]"></div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { relativizeURL, getOrigin, filterProducts } from '@/lib/helper'

const route = useRoute()
const router = useRouter()

const xHostHeader = useRequestHeaders(['x-host'])
const xHost = xHostHeader['x-host']

const hostHeader = useRequestHeaders(['host'])
const host = xHostHeader['host']

const origin = getOrigin({ headers: { host: xHost ?? host } })

const fetchURL = (route) => {
  return `${origin}/edgio-api/${route.params.name ? `categories/${route.params.name}` : 'products/all'}`
}

const { data } = await useFetch(fetchURL(route))

const finalProducts = useState('finalProducts', () => {
  return filterProducts(route.params.name ? data.value['items'] : data.value, route.query.filter)
})

const createFilter = async () => {
  if (!route.path.includes('/commerce')) return
  if (!route.query || (!route.query['filter'] && route.path.includes('commerce'))) {
    router.push({ path: route.path, query: { filter: 'trending' } })
  }
  const resp = await fetch(fetchURL(route))
  if (resp.ok) {
    const data = await resp.json()
    finalProducts.value = filterProducts(route.params.name ? data['items'] : data, route.query.filter)
  }
}

onMounted(() => {
  createFilter()
  watch(() => route.query, createFilter)
})
</script>
