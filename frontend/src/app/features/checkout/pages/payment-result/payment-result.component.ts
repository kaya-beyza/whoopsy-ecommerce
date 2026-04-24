import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-payment-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-result.component.html',
  styleUrl: './payment-result.component.scss'
})
export class PaymentResultComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  orderId = signal<string>('');
  status = signal<'success' | 'failed'>('success');
  errorMessage = signal<string>('');
  amount = signal<number | null>(null);
  cardLastFour = signal<string>('');

  ngOnInit(): void {
    this.orderId.set(this.route.snapshot.paramMap.get('orderId') ?? '');
    const qp = this.route.snapshot.queryParamMap;
    this.status.set(qp.get('status') === 'failed' ? 'failed' : 'success');
    this.errorMessage.set(qp.get('error') ?? '');
    const amt = qp.get('amount');
    if (amt) this.amount.set(Number(amt));
    this.cardLastFour.set(qp.get('last4') ?? '');
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  goToOrders(): void {
    this.router.navigate(['/orders']);
  }

  retry(): void {
    this.router.navigate(['/checkout']);
  }
}
