import '../entities/product.dart';

abstract class IProductRepository {
  Future<List<Product>> getProductsByCategoryId(String id);
}
