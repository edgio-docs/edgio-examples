import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-product-items',
  templateUrl: './product-items.component.html',
  styleUrls: ['./product-items.component.css'],
})
export class ProductItemsComponent implements OnInit {
  productItems: any[] = []
  currentSegment: any = ''

  fetchItems(category?: string) {
    if (typeof window !== 'undefined') {
      fetch(
        `https://edgio-community-ecommerce-api-example-default.layer0-limelight.link/${category ? 'categories' : 'products'}/${category || 'all'}`
      )
        .then((res) => res.json())
        .then((res) => {
          let items = []
          try {
            const products = res['items']
            if (!products) {
              throw new Error()
            }
            items = products
          } catch (e) {
            items = res
          } finally {
            this.productItems = items
            if (typeof window !== 'undefined') {
              const search = new URLSearchParams(window.location.search.substring(1))
              if (search.has('filter')) {
                this.productItems = this.filterProducts(items, search.get('filter'))
              }
            }
          }
        })
    }
  }

  filterProducts = (data: any, filter: any) => {
    let temp = data
    if (filter) {
      if (filter === 'trending') {
        temp.sort((a: any, b: any) => (Math.random() > 0.5 ? 1 : -1))
      } else if (filter === 'price-low-to-high') {
        temp.sort((a: any, b: any) => (a.price.value > b.price.value ? 1 : -1))
      } else if (filter === 'price-high-to-low') {
        temp.sort((a: any, b: any) => (a.price.value > b.price.value ? -1 : 1))
      }
    }
    return temp
  }

  constructor(route: ActivatedRoute) {
    route.url.subscribe((i) => {
      if (i.length > 0) {
        const path = i[0].path
        if (path !== this.currentSegment) {
          this.currentSegment = path
          if (path.includes('shop-all')) {
            this.fetchItems()
          } else {
            this.fetchItems(path)
          }
        }
      } else {
        this.fetchItems()
      }
    })
    route.queryParams.subscribe((i) => {
      if (i['filter']) {
        this.productItems = this.filterProducts(this.productItems, i['filter'])
      }
    })
  }

  ngOnInit(): void {}
}
