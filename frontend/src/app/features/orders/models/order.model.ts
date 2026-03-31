export interface Order {
  id: string;
  customerName: string;
  orderDate: Date;
  totalAmount: number;
  status: 'Bekliyor' | 'Hazırlanıyor' | 'Kargolandı' | 'Teslim Edildi' | 'İptal Edildi';
}

export interface OrderResponse {
  items: Order[];
  totalCount: number; // Sayfalama için toplam kayıt sayısı
}