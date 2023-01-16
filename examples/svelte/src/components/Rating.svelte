<script>
  export let value
</script>

<div class="flex items-center mt-1">
  {#each Array(5) as _, i}
    {#if Math.round(value) >= i + 1}
      <svg
        class="w-4 h-4 fill-current text-yellow-600"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
      >
        <path
          d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
        />
      </svg>
    {:else}
      <svg
        class="w-4 h-4 fill-current text-gray-400"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
      >
        <path
          d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
        />
      </svg>
    {/if}
  {/each}
</div>
