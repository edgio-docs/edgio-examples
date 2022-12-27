import { createResource } from 'solid-js'
import { filterProducts } from '../lib/helper'

const fetchProducts = async ({ name, filter }) => {
  let resp = await fetch(name ? `/l0-api/categories/${name}` : '/l0-api/products/all')
  let data = await resp.json()
  if (name) {
    data = data['items']
  }
  if (filter) {
    data = filterProducts(data, filter)
  }
  return data
}

const fetchLeftSideBarItems = async () => {
  let resp = await fetch('/l0-api/categories/all')
  let data = await resp.json()
  return data
}

export default function CommerceData({ params, location }) {
  const [products] = createResource(
    () => ({ name: params.name, filter: new URLSearchParams(location.search.substring(1)).get('filter') }),
    fetchProducts
  )
  const [leftSideBarItems] = createResource(
    () => ({ name: params.name, filter: new URLSearchParams(location.search.substring(1)).get('filter') }),
    fetchLeftSideBarItems
  )
  return { products, leftSideBarItems }
}
