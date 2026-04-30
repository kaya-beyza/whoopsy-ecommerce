import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../cart/services/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  private cartService = inject(CartService);

  // Bu verileri normalde CartService'den çekeceğiz, şimdilik UI test için sinyaller
  shippingCost = signal<number>(49.99);
  subTotal = signal<number>(28389.00); 
  total = computed(() => this.subTotal() + this.shippingCost());

  // Form adımlarını kontrol etmek için
  currentStep = signal<number>(1); // 1: Adres, 2: Ödeme

  goToPayment() {
    this.currentStep.set(2);
    window.scrollTo(0, 0); // Üste kaydır
  }

  completeOrder() {
    console.log("Sipariş başarıyla tamamlandı!");
    // Burada backend'e sipariş oluşturma isteği atılacak
  }
}