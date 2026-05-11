// ─────────────────────────────────────────────────────────────
// Admin sipariş listesi (mevcut /orders sayfası — dokunma)
// ─────────────────────────────────────────────────────────────
export interface Order {
  id: string;
  customerName: string;
  orderDate: Date;
  totalAmount: number;
  status: 'Bekliyor' | 'Hazırlanıyor' | 'Kargolandı' | 'Teslim Edildi' | 'İptal Edildi';
}

export interface OrderResponse {
  items: Order[];
  totalCount: number;
}

// ─────────────────────────────────────────────────────────────
// Kullanıcının kendi siparişleri (/profile/orders)
// Backend OrderStatus enum string olarak geliyor (JsonStringEnumConverter)
// ─────────────────────────────────────────────────────────────
export type OrderStatus = 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface MyOrderItem {
  productId: string;
  productName: string;
  imageUrl: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface MyOrder {
  id: string;
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: string;
  createdDate: string;
  orderItems: MyOrderItem[];
}

export interface MyOrderDetail {
  id: string;
  userId: string;
  userFullName: string;
  userEmail: string;
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: string;
  createdDate: string;
  updatedDate: string | null;
  orderItems: MyOrderItem[];
}
