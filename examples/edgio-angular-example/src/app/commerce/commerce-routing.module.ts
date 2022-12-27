import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CommerceComponent } from './commerce.component'
import { ProductItemsComponent } from './product-items/product-items.component'

const routes: Routes = [
  {
    path: '',
    component: CommerceComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'shop-all',
      },
      {
        path: ':name',
        component: ProductItemsComponent,
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommerceRoutingModule {}
