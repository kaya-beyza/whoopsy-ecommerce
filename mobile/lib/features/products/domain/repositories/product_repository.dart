import 'package:mobile/features/products/data/datasources/product_remote_data_source.dart';

import '../entities/product.dart';

abstract class IProductRepository {
  Future<List<Product>> getAllProducts();
  Future<List<Product>> getProductsByCategoryId(String id);
}
