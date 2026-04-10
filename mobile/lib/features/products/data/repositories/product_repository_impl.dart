import 'package:mobile/features/products/domain/entities/product.dart';
import '../../domain/repositories/product_repository.dart';
import '../../data/models/product_model.dart';
import '../../data/datasources/product_remote_data_source.dart';

class ProductRepositoryImpl implements IProductRepository {
  final ProductRemoteDataSource remoteDataSource;

  ProductRepositoryImpl(this.remoteDataSource);

  // ✅ TÜM ÜRÜNLER
  @override
  Future<List<Product>> getAllProducts() async {
    final jsonList = await remoteDataSource.getAllProducts();

    return jsonList.map((json) => ProductModel.fromJson(json)).toList();
  }

  // ✅ CATEGORY FILTER (hala lazım olabilir)
  @override
  Future<List<Product>> getProductsByCategoryId(String id) async {
    final jsonList = await remoteDataSource.getProductsByCategoryId(id);

    return jsonList.map((json) => ProductModel.fromJson(json)).toList();
  }

  Future<List<Product>> getProductsByGender(int gender,
      {String? categoryId}) async {
    final jsonList = await remoteDataSource.getProductsByGender(
      gender,
      categoryId: categoryId,
    );

    return jsonList.map((json) => ProductModel.fromJson(json)).toList();
  }
}
