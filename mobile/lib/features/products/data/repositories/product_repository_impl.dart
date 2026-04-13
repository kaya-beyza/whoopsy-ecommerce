import 'package:mobile/features/products/domain/entities/product.dart';
import '../../domain/repositories/product_repository.dart';
import '../../data/models/product_model.dart';
import '../../data/datasources/product_remote_data_source.dart';

class ProductRepositoryImpl implements IProductRepository {
  final ProductRemoteDataSource remoteDataSource;

  ProductRepositoryImpl(this.remoteDataSource);

  /// 🔥 TÜM ÜRÜNLER
  @override
  Future<List<Product>> getAllProducts() async {
    final jsonList = await remoteDataSource.getAllProducts();
    return jsonList.map((json) => ProductModel.fromJson(json)).toList();
  }

  /// 🔥 CATEGORY
  @override
  Future<List<Product>> getProductsByCategoryId(String id) async {
    final jsonList = await remoteDataSource.getProductsByCategoryId(id);
    return jsonList.map((json) => ProductModel.fromJson(json)).toList();
  }

  /// 🔥 GENDER (+ optional category)
  Future<List<Product>> getProductsByGender(int gender,
      {String? categoryId}) async {
    final jsonList = await remoteDataSource.getProductsByGender(
      gender,
      categoryId: categoryId,
    );

    return jsonList.map((json) => ProductModel.fromJson(json)).toList();
  }

  /// 🔥 BRAND (🔥 SENDE EKSİK OLAN)
  Future<List<Product>> getProductsByBrand(int brand) async {
    final jsonList = await remoteDataSource.getProductsByBrand(brand);

    return jsonList.map((json) => ProductModel.fromJson(json)).toList();
  }

  /// 🔥 FILTER (en son fallback)
  @override
  Future<List<Product>> getFilteredProducts({
    int? gender,
    int? brand,
    String? categoryId,
  }) async {
    final jsonList = await remoteDataSource.getFilteredProducts(
      gender: gender,
      brand: brand,
      categoryId: categoryId,
    );

    return jsonList.map((e) => ProductModel.fromJson(e)).toList();
  }
}
