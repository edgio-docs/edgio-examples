<template>
  <Page>
    <div class="w-full flex flex-col items-center">
      <div class="pb-5 flex flex-col max-w-6xl lg:flex-row">
        <div class="relative flex w-full lg:w-1/2 flex-col items-start">
          <div class="z-10 absolute top-0 left-0 flex flex-col items-start">
            <h3 class="border border-gray-200 bg-white py-2 px-4 text-2xl font-bold text-black">{{ data ? data.name : '' }}</h3>
            <h4 class="border border-gray-200 bg-white py-2 px-4 text-lg text-black">
              {{ data ? data.prices.price.value : '' }} {{ data ? data.prices.price.currencyCode : '' }}
            </h4>
          </div>
          <heart-icon className="z-10 border border-gray-200 absolute top-0 right-0 h-[50px] w-[50px] bg-white p-2" />
          <div v-if="data" class="w-full flex flex-col items-center">
            <img v-if="data.images" loading="lazy" :src="relativizeURL(data.images[0].url)" class="h-auto w-full max-w-[600px]" />
          </div>
          <div v-else class="w-full flex flex-col items-center">
            <div class="h-[600px] w-full animate-pulse bg-white/50 max-w-[600px]">&nbsp;</div>
          </div>
          <div v-if="data" class="mt-5 product-thumbnails flex flex-row gap-x-2 items-start overflow-x-scroll">
            <img
              loading="lazy"
              :key="image.url"
              v-for="image in data.images"
              :src="relativizeURL(image.url)"
              class="h-[250px] w-auto hover:bg-white"
            />
          </div>
        </div>
        <div class="flex w-full lg:w-1/2 flex-col items-start px-10">
          <h1 :class="{ 'w-full animate-pulse bg-white/50 h-[10px]': !data || !data.name }" class="mt-10 text-3xl font-bold text-white lg:mt-0">
            {{ data ? data.name : '&nbsp;' }}
          </h1>
          <h2
            v-html="getDescription(data)"
            class="text-md mt-5 font-light text-[#FFFFFF75]"
            :class="{ 'w-full animate-pulse bg-white/50 h-[50px]': !data || !data.name }"
          ></h2>
          <div class="mt-10 flex w-full flex-row justify-between">
            <div class="flex flex-row items-center space-x-1">
              <star-icon class="h-[20px] w-[20px] text-[#FFFFFF75]" />
              <star-icon class="h-[20px] w-[20px] text-[#FFFFFF75]" />
              <star-icon class="h-[20px] w-[20px] text-[#FFFFFF75]" />
              <star-icon class="h-[20px] w-[20px] text-[#FFFFFF75]" />
              <star-icon-outline class="h-[18px] w-[18px] text-[#FFFFFF75]" />
            </div>
            <span class="text-[#FFFFFF75]">36 reviews</span>
          </div>
          <button class="mt-5 w-full bg-black px-2 py-4 uppercase text-white">Add To Cart</button>
          <span class="mt-5 text-lg font-medium text-white">Care</span>
          <span class="mt-2 font-light text-[#FFFFFF75]">This is a limited edition production run. Printing starts when the drop ends.</span>
          <div class="mt-5 h-[1px] w-full bg-[#FFFFFF30]"></div>
          <span class="mt-5 text-lg font-medium text-white">Details</span>
          <span class="mt-2 font-light text-[#FFFFFF75]">
            This is a limited edition production run. Printing starts when the drop ends. Reminder: Bad Boys For Life. Shipping may take 10+ days due
            to COVID-19.
          </span>
          <div class="mt-5 h-[1px] w-full bg-[#FFFFFF30]"></div>
        </div>
      </div>
    </div>
  </Page>
</template>

<style scoped>
.product-thumbnails {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.product-thumbnails::-webkit-scrollbar {
  display: none;
}
</style>

<script>
import Page from '@/layouts/page.vue'
import { relativizeURL } from '@/lib/helper'
import StarIcon from '@/components/StarIcon.vue'
import HeartIcon from '@/components/HeartIcon.vue'
import StarIconOutline from '@/components/StarIconOutline.vue'

export default {
  name: 'Product',
  components: {
    Page,
    HeartIcon,
    StarIcon,
    StarIconOutline,
  },
  data: () => {
    return {
      data: undefined,
    }
  },
  methods: {
    relativizeURL: (url) => relativizeURL(url),
    getDescription: (data) => (data ? data.description : ''),
    fetchData() {
      if (typeof window !== 'undefined') {
        let link = window.location.origin
        let slug = window.location.pathname.replace('/product.html', '').replace('/product/', '').replace('.html', '')
        fetch(`${link}/l0-api/products/${slug}`)
          .then((res) => res.json())
          .then((res) => {
            this.data = res
          })
      }
    },
  },
  mounted() {
    this.fetchData()
  },
}
</script>