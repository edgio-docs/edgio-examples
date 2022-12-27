import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { CommerceRoutingModule } from './commerce-routing.module'
import { CommerceComponent } from './commerce.component'
import { SortingComponentComponent } from './sorting-component/sorting-component.component'
import { FilterComponentComponent } from './filter-component/filter-component.component'
import { ProductItemsComponent } from './product-items/product-items.component'

@NgModule({
  declarations: [CommerceComponent, SortingComponentComponent, FilterComponentComponent, ProductItemsComponent],
  imports: [CommonModule, CommerceRoutingModule],
})
export class CommerceModule {}
