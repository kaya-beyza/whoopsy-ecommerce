import { Routes } from '@angular/router';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { PaymentResultComponent } from './pages/payment-result/payment-result.component';

export const checkoutRoutes: Routes = [
  { path: '', component: CheckoutComponent },
  { path: 'result/:orderId', component: PaymentResultComponent }
];
