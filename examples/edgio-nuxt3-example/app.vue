<template>
  <div className="flex flex-col bg-gradient-to-br from-[#9a1ab1] via-[#004966] to-[#01B18D] min-h-screen">
    <Navbar />
    <NuxtPage />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import EdgioRUM from './edgio/rum'

onMounted(() => {
  // Monitor real user as it gets mounted
  EdgioRUM('2e2f71ee-47a2-4789-9208-825beee15863')
})
</script>

<style scoped>
* {
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>
