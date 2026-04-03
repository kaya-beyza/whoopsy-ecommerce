// 1. GET (Listeleme) işlemi için kullanacağımız, ID içeren model
export interface Product {
  id: string; // Backend Guid gönderdiği için string yapıyoruz
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  categoryId: string;
}

// 2. POST (Oluşturma) işlemi için kullanacağımız, ID içermeyen model
export interface CreateProduct {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  categoryId: string;
}