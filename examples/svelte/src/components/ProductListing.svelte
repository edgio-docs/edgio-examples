<script>
  import Rating from './Rating.svelte'
  import { Prefetch } from '@layer0/svelte'
  import { getCategory } from '../lib/cms'
  let data= []
  export let slug
  const fetchProducts = async (slug) => {
    const response = await getCategory(slug)
    data= await response.products
  }
  $: {
    fetchProducts(slug)
  }
  import { Link } from 'svelte-navigator'
</script>

<div class="flex flex-col items-center">
  <div class="mt-10 grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {#each data as product}
      <Link to={product.href}>
        <Prefetch url={`/api${product.href}`}>
          <div class="relative flex flex-col items-center">
            <div
              class="pb-2/3 bg-contain bg-center bg-no-repeat h-48 w-48"
              style="background-image: url('{product.picture}')"
            />
            <p class="text-center lowercase font-bold">{product.name}</p>
            <Rating value={product.rating} />
            <p class="text-center">{product.price}</p>
          </div>
        </Prefetch>
      </Link>
    {/each}
  </div>
</div>
