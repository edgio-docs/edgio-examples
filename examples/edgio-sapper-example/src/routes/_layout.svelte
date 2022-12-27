<script>
  import Nav from '../components/Nav.svelte'
  import GlobalStyle from '../components/GlobalStyle.svelte'

  export let segment
</script>

<Nav {segment} />
<GlobalStyle />
<slot />
