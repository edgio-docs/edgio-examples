// Import fetch to fetch and create prerender routes
import fetch from 'node-fetch'

// Function to create all the paths to prerender
export default async function getPathsToPrerender() {
  const prerenderPaths = ['/']
  // Get all the slugs for the product pages
  const respCall = await fetch('https://edgio-community-ecommerce-api-example-default.layer0-limelight.link/products/all')
  if (respCall.ok) {
    const resp = await respCall.json()
    // For each product, derive the non slash path and create the gatsby data url to populate on the edge
    resp.forEach((i) => {
      prerenderPaths.push(`/product/${i.slug}`)
    })
  } else {
    console.log('The fetch call failed, no paths to populate cache with.')
  }
  // Finally, return all the paths with the intended mapping to Edgio prerender syntax
  return prerenderPaths.filter((i) => i).map((i) => ({ path: i }))
}
