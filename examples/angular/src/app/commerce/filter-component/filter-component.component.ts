import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-filter-component',
  templateUrl: './filter-component.component.html',
  styleUrls: ['./filter-component.component.css'],
})
export class FilterComponentComponent implements OnInit {
  filterItems: any[] = []

  constructor() {}

  ngOnInit(): void {
    if (typeof window !== 'undefined')
      fetch('https://edgio-community-ecommerce-api-example-default.layer0-limelight.link/categories/all')
        .then((res) => res.json())
        .then((res) => {
          this.filterItems = res
        })
  }

  getCurrentRoute(i: string) {
    if (typeof window !== 'undefined') {
      return window.location.pathname === `/commerce/${i}`
    }
    return false
  }
}
