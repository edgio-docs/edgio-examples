import { getCategories, getApiPath } from '../lib/cms'

export default async function getPrerenderRequests() {
  const { categories } = await getCategories()
  const requests = categories.map((c) => ({ path: getApiPath(c.href) }))

  categories.forEach((c) => {
    requests.push(...c.items.map((p) => ({ path: getApiPath(p.href) })))
  })

  return requests
}
