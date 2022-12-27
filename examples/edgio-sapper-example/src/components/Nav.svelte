<script>
  import { onMount } from 'svelte'
  import { stores } from '@sapper/app'
  import { Prefetch } from '@layer0/svelte'
  import { getCategories, getApiPath } from '../../lib/cms'

  export let categories = []

  const { page } = stores()

  onMount(async () => {
    const data = await getCategories()
    categories = data.categories
  })
</script>

<header class="bg-white pt-2 flex flex-col items-center">
  <a href="/">
    <img src="/layer0-icon.svg" alt="Layer0 Logo" />
    <div class="text-center text-gray-700">Sapper Example</div>
  </a>
  <div class="flex flex-col items-center w-full border-b-[1px] border-[#eaeaea]">
    <div class={`py-4 w-2/3 md:flex flex flex-row justify-between`}>
      {#each categories as category, i}
        <div>
          <Prefetch url={getApiPath(category.href)} immediately>
            <a aria-current={$page.path === category.href ? 'page' : undefined} href={category.href}
              >{category.categoryName}</a
            >
          </Prefetch>
        </div>
      {/each}
    </div>
  </div>
</header>
