<template>
  <div class="flex flex-col bg-gradient-to-br from-[#9a1ab1] via-[#004966] to-[#01B18D] min-h-screen">
    <Header />
    <Nuxt />
  </div>
</template>

<script>
import EdgioRUM from '@/edgio/rum.js'
import Header from '@/components/Header.vue'
import { install } from '@edgio/prefetch/window'
import installDevtools from '@edgio/devtools/install'

export default {
  components: {
    Header,
  },
  mounted: () => {
    // Monitor real user as it gets mounted
    EdgioRUM('1f41ba2b-dc10-4935-8d7d-62ac857a4d63')
    // Enable service worker inside the window
    install()
    // Enable devtools manually, instead of relying on defaults by Edgio
    installDevtools()
  },
}
</script>
