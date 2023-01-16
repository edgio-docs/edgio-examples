import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AboutComponent } from './about/about.component'
import { HomeComponent } from './home/home.component'
import { ProductComponent } from './product/product.component'

const routes: Routes = [
  { path: 'about', component: AboutComponent },
  { path: 'commerce', loadChildren: () => import('./commerce/commerce.module').then((m) => m.CommerceModule) },
  { path: '', component: HomeComponent },
  { path: 'product/:name', component: ProductComponent },
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
