import { install, prefetch } from '@edgio/prefetch/window'

install({
  watch: [
    {
      selector: 'a',
      callback: (el) => {
        const productID = el.getAttribute('href')
        if (productID && productID.length > 0 && productID.startsWith('/')) prefetch(productID, 'fetch')
      },
    },
  ],
})
