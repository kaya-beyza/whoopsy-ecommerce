import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ProductService } from '../../../../core/services/product.service';
import { CreateProduct, Product } from '../../../../core/models/product.model';

@Component({
  selector: 'app-product-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent implements OnInit {
  private productService = inject(ProductService);

  // Düzenleme modunda mıyız kontrolü için değişken (Null ise ekleme modundayız)
  editingProductId: string | null = null;

  productData: CreateProduct = {
    name: '', description: '', price: 0, stockQuantity: 0, categoryId: '' 
  };

  isSubmitting = false;
  products: Product[] = []; 
  toasts: { id: number, message: string, type: 'success' | 'error' }[] = [];
  private toastIdCounter = 0;

  ngOnInit() {
    this.loadProducts(); 
  }

  // LİSTEDEN DÜZENLEYE BASILINCA ÇALIŞACAK METOT
  onEditProduct(urun: Product) {
    this.editingProductId = urun.id; // Düzenleme moduna geç
    
    // Sol taraftaki formu, seçilen ürünün bilgileriyle doldur
    this.productData = {
      name: urun.name,
      description: urun.description,
      price: urun.price,
      stockQuantity: urun.stockQuantity,
      categoryId: urun.categoryId
    };
    
    // Kullanıcının dikkatini sola çekmek için sayfanın en üstüne kaydır
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.showToast('Ürün bilgileri forma yüklendi.', 'success');
  }

  // DÜZENLEMEDEN VAZGEÇİLDİĞİNDE ÇALIŞACAK METOT
  cancelEdit(form: NgForm) {
    this.editingProductId = null; // Ekleme moduna dön
    form.resetForm();
    this.productData.categoryId = '';
  }

  // FORM KAYDEDİLDİĞİNDE (EKLEME VEYA GÜNCELLEME) ÇALIŞACAK METOT
  onSubmit(form: NgForm) {
    if (form.invalid) {
      this.showToast('Lütfen zorunlu alanları doldurun.', 'error');
      return;
    }

    this.isSubmitting = true;

    // EĞER DÜZENLEME MODUNDAYSAK (PUT İsteği)
    if (this.editingProductId) {
      const updatePayload = {
        ...this.productData,
        id: this.editingProductId,
        isActive: true
      };

      this.productService.updateProduct(this.editingProductId, updatePayload).subscribe({
        next: () => {
          this.showToast('Ürün başarıyla GÜNCELLENDİ!', 'success');
          this.isSubmitting = false;
          this.cancelEdit(form); // Formu temizle ve normale dön
          this.loadProducts();   // Listeyi yenile
        },
        error: (err) => {
          console.error(err);
          this.showToast('Güncelleme sırasında hata oluştu.', 'error');
          this.isSubmitting = false;
        }
      });
    } 
    // EĞER EKLEME MODUNDAYSAK (POST İsteği)
    else {
      this.productService.createProduct(this.productData).subscribe({
        next: () => {
          this.showToast('Ürün başarıyla EKLENDİ!', 'success');
          this.isSubmitting = false;
          this.cancelEdit(form);
          this.loadProducts();
        },
        error: (err) => {
          console.error(err);
          this.showToast('Ürün eklenirken hata oluştu.', 'error');
          this.isSubmitting = false;
        }
      });
    }
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (gelenVeriler) => { this.products = gelenVeriler; },
      error: () => { this.showToast('Ürünler çekilemedi.', 'error'); }
    });
  }

  showToast(message: string, type: 'success' | 'error') {
    const id = this.toastIdCounter++;
    this.toasts.push({ id, message, type });
    setTimeout(() => { this.toasts = this.toasts.filter(t => t.id !== id); }, 3000);
  }
}