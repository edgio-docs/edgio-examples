import { Metrics } from '@edgio/rum'
import install from '@edgio/prefetch/window/install'
import installDevtools from '@edgio/devtools/install'
import { prefetch } from '@edgio/prefetch/window/prefetch'

new Metrics({
  // Get your token from the Edgio Console
  token: '0fd2901b-39ee-4a74-add9-bc3c1afa22a8',
}).collect()

document.addEventListener('DOMContentLoaded', () => {
  install({
    watch: [
      {
        selector: 'a[href^="/"]',
        callback: (el) => {
          const href = el.getAttribute('href')
          if (href) prefetch(href)
        },
      },
    ],
  })
  installDevtools()
})
