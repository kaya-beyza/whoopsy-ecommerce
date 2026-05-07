import '../entities/product.dart';
import '../repositories/product_repository.dart';

class GetProductsByCategoryUseCase {
  final IProductRepository repository;

  GetProductsByCategoryUseCase(this.repository);

  Future<List<Product>> execute(String categoryId) async {
    return await repository.getProductsByCategoryId(categoryId);
  }
}
