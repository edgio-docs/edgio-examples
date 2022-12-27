<script context="module">
  import { getCategory, getApiPath } from '../../../lib/cms'

  export async function preload({ params }) {
    const { products } = await getCategory(params.name)

    return { products }
  }
</script>

<script>
  import { Prefetch } from '@layer0/svelte'
  import Rating from '../../components/Rating.svelte'

  export let products = []
</script>

<div class="flex flex-col items-center">
  <div class="mt-10 grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {#each products as product}
      <a href={product.href}>
        <Prefetch url={getApiPath(product.href)}>
          <div class="relative flex flex-col items-center">
            <div
              data-image-src={product.picture}
              class="pb-2/3 bg-contain bg-center bg-no-repeat h-48 w-48"
              style="background-image: url({product.picture})"
            />
            <p class="text-center lowercase font-bold">{product.name}</p>
            <Rating value={product.rating} />
            <p class="text-center">${product.price}</p>
          </div>
        </Prefetch>
      </a>
    {/each}
  </div>
</div>
