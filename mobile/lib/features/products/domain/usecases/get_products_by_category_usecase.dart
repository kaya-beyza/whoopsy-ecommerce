import '../entities/product.dart';
import '../repositories/product_repository.dart';

class GetProductsByCategoryUseCase {
  final IProductRepository repository;

  GetProductsByCategoryUseCase(this.repository);

  /// Execute metodu, bu UseCase çağrıldığında çalışacak olan ana fonksiyondur.
  Future<List<Product>> execute(String categoryId) async {
    // Domain katmanı olduğu için burada herhangi bir API URL'si veya JSON işlemi olmaz.
    // Sadece repository üzerinden veriyi ister.
    return await repository.getProductsByCategoryId(categoryId);
  }
}
