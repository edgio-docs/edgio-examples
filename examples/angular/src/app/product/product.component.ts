import { HttpClient } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  data: any = null

  constructor(route: ActivatedRoute, private http: HttpClient) {
    route.url.subscribe(async (i) => {
      if (i[1].path) {
        this.data = await this.http
          .get(`https://edgio-community-ecommerce-api-example-default.layer0-limelight.link/products/${i[1].path}`)
          .toPromise()
      }
    })
  }

  ngOnInit(): void {}
}
