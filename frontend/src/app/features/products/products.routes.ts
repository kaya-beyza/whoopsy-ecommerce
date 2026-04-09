import { Routes } from '@angular/router';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { ProductListWithCategoryidComponent } from './pages/product-list-with-categoryid/product-list-with-categoryid.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { ProductListWithBrandComponent } from './pages/product-list-with-brand/product-list-with-brand';

export const routes: Routes = [
  {
    path: '',
    component: ProductListComponent
  },
  {
    path: 'kategori/:id',
    component: ProductListWithCategoryidComponent
  },
  {
    path: 'marka/:brand',
    component: ProductListWithBrandComponent
  },
  {
    path: 'detay/:id',
    component: ProductDetailComponent
  }
];