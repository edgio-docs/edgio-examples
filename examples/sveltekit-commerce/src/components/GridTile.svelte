<script>
  export let title = ''
  export let removeLabels = false
  export let imageSrc
  export let price = ''
  export let currencyCode = ''
  export let href = ''
  export let priority = 'lazy'

  let hover = false
</script>

<div
  on:mouseenter={() => {
    hover = true
  }}
  on:mouseleave={() => {
    hover = false
  }}
  class="h-full w-full overflow-hidden"
>
  <a
    data-test="grid-tile"
    {href}
    data-sveltekit-prefetch
    class="relative flex h-full w-full items-center justify-center focus:border-2 focus:border-blue-500"
  >
    <img
      alt={title}
      class={`w-full flex-none transition duration-300 ease-in-out md:w-1/2 lg:w-full ${hover ? 'scale-110' : ''}`}
      fetchpriority={priority === 'eager' ? 'high' : 'low'}
      decoding="async"
      loading={priority}
      src={imageSrc}
    />
    {#if !removeLabels}
      <div class="absolute top-0 left-0">
        <div class="bg-black p-3 text-2xl  font-medium">
          {title}
        </div>
        <div class="w-fit bg-black p-3 text-sm">
          ${price}
          {currencyCode}
        </div>
      </div>
    {/if}
  </a>
</div>
