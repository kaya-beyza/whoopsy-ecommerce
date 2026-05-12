import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { UserContextService } from '../../services/user-context.service';
import {
  CheckoutCartItem,
  CreateOrderRequest,
  CreatePaymentRequest
} from '../../models/payment.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  private paymentService = inject(PaymentService);
  private userContext = inject(UserContextService);
  private router = inject(Router);

  cartItems = signal<CheckoutCartItem[]>([]);
  shippingCost = signal<number>(49.99);
  isSubmitting = signal<boolean>(false);
  errorMessage = signal<string>('');
  cardFlipped = signal<boolean>(false);

  buyerName = '';
  buyerSurname = '';
  buyerEmail = '';
  buyerPhone = '';
  buyerAddress = '';
  buyerCity = '';

  cardHolderName = '';
  cardNumberDisplay = '';
  expireMonth = '';
  expireYear = '';
  cvc = '';
  termsAccepted = false;

  get subTotal(): number {
    return this.cartItems().reduce((acc, i) => acc + i.price * i.quantity, 0);
  }

  get total(): number {
    return this.subTotal > 0 ? this.subTotal + this.shippingCost() : 0;
  }

  get cardNumberDigits(): string {
    return this.cardNumberDisplay.replace(/\s/g, '');
  }

  get cardNumberMasked(): string {
    const d = this.cardNumberDigits;
    if (!d) return '•••• •••• •••• ••••';
    const padded = d.padEnd(16, '•');
    return padded.match(/.{1,4}/g)!.join(' ');
  }

  get isFormValid(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const m = parseInt(this.expireMonth, 10);
    return (
      this.buyerName.trim().length > 0 &&
      this.buyerSurname.trim().length > 0 &&
      emailRegex.test(this.buyerEmail) &&
      this.buyerPhone.trim().length > 0 &&
      this.buyerAddress.trim().length > 0 &&
      this.buyerCity.trim().length > 0 &&
      this.cardHolderName.trim().length > 0 &&
      this.cardNumberDigits.length === 16 &&
      m >= 1 && m <= 12 &&
      this.expireYear.length === 2 &&
      this.cvc.length === 3 &&
      this.termsAccepted
    );
  }

  ngOnInit(): void {
    const state = history.state as { cartItems?: CheckoutCartItem[] };
    if (state?.cartItems && Array.isArray(state.cartItems) && state.cartItems.length > 0) {
      this.cartItems.set(state.cartItems);
    }
  }

  onCardNumberInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 16);
    const formatted = digits.match(/.{1,4}/g)?.join(' ') ?? '';
    this.cardNumberDisplay = formatted;
    input.value = formatted;
    if (digits.length === 16) {
      document.getElementById('expireMonth')?.focus();
    }
  }

  onExpireMonthInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let digits = input.value.replace(/\D/g, '').slice(0, 2);

    // 2-9 ile başlayan tek haneyi "02"-"09" olarak tamamla (hızlı ay girişi).
    if (digits.length === 1 && parseInt(digits, 10) >= 2) {
      digits = '0' + digits;
    }

    // İki haneli değer 01-12 aralığında değilse ikinci haneyi reddet.
    if (digits.length === 2) {
      const m = parseInt(digits, 10);
      if (m < 1 || m > 12) {
        digits = digits.charAt(0);
      }
    }

    this.expireMonth = digits;
    input.value = digits;
    if (digits.length === 2) {
      document.getElementById('expireYear')?.focus();
    }
  }

  onExpireYearInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 2);
    this.expireYear = digits;
    input.value = digits;
    if (digits.length === 2) {
      document.getElementById('cvc')?.focus();
    }
  }

  onCvcInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 3);
    this.cvc = digits;
    input.value = digits;
  }

  onCvcFocus(): void { this.cardFlipped.set(true); }
  onCvcBlur(): void { this.cardFlipped.set(false); }

  private showError(message: string): void {
    this.errorMessage.set(message);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  fillTestShipping(): void {
    this.buyerName = 'Ahmet';
    this.buyerSurname = 'Eren';
    this.buyerEmail = 'test@whoopsy.com';
    this.buyerPhone = '+90 555 123 45 67';
    this.buyerAddress = 'Atatürk Mah. Cumhuriyet Cad. No:1 D:5';
    this.buyerCity = 'İstanbul';
  }

  fillTestCard(cardNumber: string): void {
    const digits = cardNumber.replace(/\D/g, '').slice(0, 16);
    const formatted = digits.match(/.{1,4}/g)?.join(' ') ?? '';
    this.cardNumberDisplay = formatted;
    this.expireMonth = '12';
    this.expireYear = '30';
    this.cvc = '123';
    if (!this.cardHolderName) this.cardHolderName = 'Test Kullanıcı';
    const numEl = document.getElementById('cardNumber') as HTMLInputElement | null;
    if (numEl) numEl.value = formatted;
    const monthEl = document.getElementById('expireMonth') as HTMLInputElement | null;
    if (monthEl) monthEl.value = '12';
    const yearEl = document.getElementById('expireYear') as HTMLInputElement | null;
    if (yearEl) yearEl.value = '30';
    const cvcEl = document.getElementById('cvc') as HTMLInputElement | null;
    if (cvcEl) cvcEl.value = '123';
  }

  goShopping(): void {
    this.router.navigate(['/']);
  }

  onSubmit(): void {
    if (!this.isFormValid || this.isSubmitting()) return;

    const userId = this.userContext.getUserId();
    if (!userId) {
      this.showError('Oturumunuz sona ermiş. Lütfen tekrar giriş yapın.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const orderRequest: CreateOrderRequest = {
      userId,
      shippingAddress: `${this.buyerAddress}, ${this.buyerCity}`,
      orderItems: this.cartItems().map(item => ({
        productId: item.id,
        quantity: item.quantity,
        unitPrice: item.price
      }))
    };

    this.paymentService.createOrder(orderRequest).subscribe({
      next: (orderId) => {
        const paymentRequest: CreatePaymentRequest = {
          orderId,
          cardHolderName: this.cardHolderName,
          cardNumber: this.cardNumberDigits,
          expireMonth: this.expireMonth,
          expireYear: this.expireYear,
          cvc: this.cvc,
          buyerName: this.buyerName,
          buyerSurname: this.buyerSurname,
          buyerEmail: this.buyerEmail,
          buyerPhone: this.buyerPhone,
          buyerAddress: this.buyerAddress,
          buyerCity: this.buyerCity
        };

        this.paymentService.createPayment(paymentRequest).subscribe({
          next: (res) => {
            this.isSubmitting.set(false);
            const queryParams: Record<string, string | number> =
              res.status === 'Success'
                ? { status: 'success', amount: res.amount, last4: res.cardLastFourDigits }
                : { status: 'failed', error: res.errorMessage ?? 'Ödeme başarısız oldu.' };
            this.router.navigate(['/checkout/result', res.orderId], { queryParams });
          },
          error: (err) => {
            this.isSubmitting.set(false);
            const msg =
              err?.error?.errorMessage ??
              err?.error?.message ??
              'Ödeme işlemi sırasında bir hata oluştu.';
            this.showError(msg);
          }
        });
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.showError(
          'Sipariş oluşturulamadı: ' + (err?.error?.message ?? err?.message ?? 'Bilinmeyen hata')
        );
      }
    });
  }
}
