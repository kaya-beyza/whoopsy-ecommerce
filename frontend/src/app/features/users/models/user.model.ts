// Backend'deki UserDto'nun frontend karşılığı
// GET api/users ve GET api/users/{id} bu yapıyı döner
export interface UserDto {
    id: string;           // Backend'de Guid → frontend'de string olarak gelir
    fullName: string;
    email: string;
    isActive: boolean;
    roleName: string;
    createdDate: string;  // Backend'de DateTime → JSON'da string olarak gelir
}

// Backend'deki OrderStatus enum'unun frontend karşılığı
// Neden enum yerine string union kullandık?
// Backend JSON'da sayı (0,1,2...) gönderir ama biz ekranda "Beklemede", "Kargoda" gibi
// Türkçe göstermek istiyoruz. Bu yüzden mapping yapacağız.
export enum OrderStatus {
    Pending = 0,
    Confirmed = 1,
    Shipped = 2,
    Delivered = 3,
    Cancelled = 4
}

// Siparişteki tek bir ürün satırı
// Örnek: "2 adet Laptop, birim fiyat 15000₺, toplam 30000₺"
export interface OrderItemDto {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

// Backend'deki OrderDto'nun frontend karşılığı
// GET api/users/{id}/orders bu yapıların listesini döner
export interface OrderDto {
    id: string;
    totalAmount: number;
    status: OrderStatus;
    shippingAddress: string;
    createdDate: string;
    orderItems: OrderItemDto[];
}