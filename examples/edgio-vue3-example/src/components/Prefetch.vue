<template>
  <slot> </slot>
</template>

<script setup>
import { onMounted, onUnmounted, nextTick, useSlots } from 'vue'
import { prefetch as doPrefetch } from '@edgio/prefetch/window/index.js'

const slots = useSlots()
const props = defineProps(['url'])
let observer = undefined

const attachObserver = () => {
  if (typeof window !== undefined) {
    if (props.url) {
      observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          doPrefetch(props.url)
          observer.disconnect()
        }
      })
      if (observer && slots.default() && slots.default()[0] && slots.default()[0].el) {
        observer.observe(slots.default()[0].el)
      }
    }
  }
}

nextTick(() => {
  attachObserver()
})

onMounted(() => {
  attachObserver()
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>
