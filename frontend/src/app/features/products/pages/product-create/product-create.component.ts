import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ProductService } from '../../../../core/services/product.service';
import { CreateProduct } from '../../../../core/models/product.model';

@Component({
  selector: 'app-product-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent {
  // Servisimizi modern inject yöntemiyle çağırıyoruz
  private productService = inject(ProductService);

  // 1. Modelin Kalıbını Hazırlama (Başlangıç değerleri boş)
  productData: CreateProduct = {
    name: '',
    description: '',
    price: 0,
    stockQuantity: 0,
    // Backend Guid beklediği için şimdilik geçerli bir sahte Guid veriyoruz.
    // İleride burayı bir açılır listeden (dropdown) seçilen kategori ID'si ile değiştirebilirsin.
    categoryId: '3fa85f64-5717-4562-b3fc-2c963f66afa6' 
  };

  // UI Durum Yönetimi
  isSubmitting = false;
  toasts: { id: number, message: string, type: 'success' | 'error' }[] = [];
  private toastIdCounter = 0;

  // 2 ve 3. Veriyi Toplama ve Kargoya Verme (Form Gönderildiğinde Çalışır)
  onSubmit(form: NgForm) {
    // Form geçersizse (örn: isim boşsa) işlemi durdur
    if (form.invalid) {
      this.showToast('Lütfen zorunlu alanları doldurun.', 'error');
      return;
    }

    this.isSubmitting = true;

    // Servise veriyi yolla
    this.productService.createProduct(this.productData).subscribe({
      next: (yeniUrunId) => {
        this.showToast('Ürün başarıyla eklendi!', 'success');
        this.isSubmitting = false;
        form.resetForm(); // İşlem bitince formu temizle
        
        // Form temizlendiğinde varsayılan değerleri geri yükle
        this.productData.categoryId = '3fa85f64-5717-4562-b3fc-2c963f66afa6'; 
      },
      error: (hata) => {
        console.error("Hata detayı:", hata);
        this.showToast('Ürün eklenirken sunucuda bir hata oluştu.', 'error');
        this.isSubmitting = false;
      }
    });
  }

  // Bildirim (Toast) Fonksiyonu
  showToast(message: string, type: 'success' | 'error') {
    const id = this.toastIdCounter++;
    this.toasts.push({ id, message, type });
    setTimeout(() => {
      this.toasts = this.toasts.filter(t => t.id !== id);
    }, 3000);
  }
}