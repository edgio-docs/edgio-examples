import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'

class RelevanceItem {
  'name': string
  'filter': string
}

@Component({
  selector: 'app-sorting-component',
  templateUrl: './sorting-component.component.html',
  styleUrls: ['./sorting-component.component.css'],
})
export class SortingComponentComponent implements OnInit {
  relevanceItems: RelevanceItem[] = [
    {
      name: 'Trending',
      filter: 'trending',
    },
    {
      name: 'Price: Low to High',
      filter: 'price-low-to-high',
    },
    {
      name: 'Price: High to Low',
      filter: 'price-high-to-low',
    },
  ]
  currentFilter: string = 'trending'

  constructor(private route: ActivatedRoute, private router: Router) {
    route.queryParams.subscribe((p) => {
      if (p['filter']) {
        this.currentFilter = p['filter']
      } else {
        this.currentFilter = 'trending'
      }
    })
  }

  navigate(item: any) {
    if (typeof window !== 'undefined') this.router.navigate([window.location.pathname], { queryParams: { filter: item.filter } })
  }

  ngOnInit(): void {}
}
