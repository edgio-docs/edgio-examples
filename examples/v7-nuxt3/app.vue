<template>
  <div className="flex flex-col bg-gradient-to-br from-[#9a1ab1] via-[#004966] to-[#01B18D] min-h-screen">
    <Navbar />
    <NuxtPage />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import Router from '@edgio/rum/Router.js'
import Metrics from '@edgio/rum/Metrics.js'

onMounted(() => {
  new Metrics({
    // Set this TOKEN as an environment variable at Edgio Console
    // More on creating env variables: https://docs.edg.io/guides/environments#creating-environment-variables
    token: '2e2f71ee-47a2-4789-9208-825beee15863',
    router: new Router()
      .match('/', ({ setPageLabel }) => setPageLabel('home'))
      .match('/commerce', ({ setPageLabel }) => setPageLabel('commerce'))
      .match('/product/:id', ({ setPageLabel }) => setPageLabel('product/:id')),
  }).collect()
})
</script>

<style scoped>
* {
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>
