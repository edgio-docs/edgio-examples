<script>
  import Index from './components/Index.svelte'
  import Header from './components/Header.svelte'
  import Product from './components/Product.svelte'
  import ProductListing from './components/ProductListing.svelte'
  import { Router, Route } from 'svelte-navigator'
</script>

<Router>
  <main>
    <Header />
    <Route path="/">
      <Index />
    </Route>
    <Route path="/category/:slug" let:params>
      <ProductListing slug={params.slug} />
    </Route>
    <Route path="/product/:slug" let:params>
      <Product slug={params.slug} />
    </Route>
  </main>
</Router>
