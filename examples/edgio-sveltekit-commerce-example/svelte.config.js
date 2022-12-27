import preprocess from 'svelte-preprocess'
import vercel from '@sveltejs/adapter-vercel'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: vercel({
      edge: false,
      external: [],
      split: false,
    }),
    alias: {
      $components: 'src/components',
      $utils: 'src/utils',
    },
  },
  preprocess: [
    preprocess({
      postcss: true,
    }),
  ],
}

export default config
