<script>
  import { getCategories } from '../lib/cms'
  import { Prefetch } from '@layer0/svelte'
  const fetchCategories = (async () => {
    const response = await getCategories()
    return await response.categories
  })()
  import { Link } from 'svelte-navigator'
</script>

<header class="bg-white pt-2 flex flex-col items-center">
  <Link to="/">
    <img width={200} height={55.59} src="/layer0-icon.svg" alt="Layer0 Logo" title="Layer0 Logo" />
    <div class="text-center text-gray-700">Svelte Example</div>
  </Link>
  <div class="flex flex-col items-center w-full border-b-[1px] border-[#eaeaea]">
    <div class="py-4 w-2/3 flex flex-row justify-between">
      {#await fetchCategories}
        {''}
      {:then data}
        {#each data as category}
          <Link to={category.href}>
            <Prefetch url={`/api${category.href}`} immediately>
              {category.categoryName}
            </Prefetch>
          </Link>
        {/each}
      {:catch error}
        {''}
      {/await}
    </div>
  </div>
</header>