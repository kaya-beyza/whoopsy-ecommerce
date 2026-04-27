// Backend CreateOrderCommand (Features/Orders/Commands/CreateOrder)
export interface CreateOrderRequest {
  userId: string;
  shippingAddress: string;
  orderItems: CreateOrderItemDto[];
}

export interface CreateOrderItemDto {
  productId: string;
  quantity: number;
  unitPrice: number;
}

// Backend CreatePaymentCommand (Features/Payment/Commands/CreatePayment)
export interface CreatePaymentRequest {
  orderId: string;
  cardHolderName: string;
  cardNumber: string;
  expireMonth: string;
  expireYear: string;
  cvc: string;
  buyerName: string;
  buyerSurname: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerAddress: string;
  buyerCity: string;
}

// Backend PaymentDto (Application/DTOs/PaymentDto)
// Backend JsonStringEnumConverter ile enum'ı string olarak serialize ediyor.
export type PaymentStatus = 'Pending' | 'Success' | 'Failed' | 'Refunded';

export interface PaymentResponse {
  id: string;
  orderId: string;
  amount: number;
  status: PaymentStatus;
  cardHolderName: string;
  cardLastFourDigits: string;
  paidAt: string | null;
  errorMessage: string | null;
}

// Checkout sayfasının Cart'tan aldığı sepet satırı (router state)
export interface CheckoutCartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  size: string;
  color: string;
}
