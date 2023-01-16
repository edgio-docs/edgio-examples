import { createResource } from 'solid-js'

const fetchProduct = async (name) => {
  let resp = await fetch(`/l0-api/products/${name}`)
  let data = await resp.json()
  return data
}

export default function ProductData({ params }) {
  const [product] = createResource(() => params.name, fetchProduct)
  return { product }
}
