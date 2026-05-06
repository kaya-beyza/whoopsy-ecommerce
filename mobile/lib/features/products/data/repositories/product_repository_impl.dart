import 'package:mobile/features/products/domain/entities/product.dart';
import 'package:mobile/features/products/domain/models/paged_response.dart';
import '../../domain/repositories/product_repository.dart';
import '../models/product_model.dart';
import '../datasources/product_remote_data_source.dart';

class ProductRepositoryImpl implements IProductRepository {
  final ProductRemoteDataSource remoteDataSource;

  ///  CACHE (çok kritik performans)
  final Map<String, Product> _cache = {};

  ProductRepositoryImpl(this.remoteDataSource);

  ///  PAGINATION ANA METHOD
  @override
  Future<PagedResponse<Product>> getFilteredProducts({
    int? gender,
    int? brand,
    String? categoryId,
    String? searchTerm,
    int page = 1,
  }) async {
    final response = await remoteDataSource.getFilteredProducts(
      gender: gender,
      brand: brand,
      categoryId: categoryId,
      searchTerm: searchTerm,
      page: page,
    );

    final products =
        response.items.map((e) => ProductModel.fromJson(e)).toList();

    ///  CACHE doldur
    for (var p in products) {
      _cache[p.id] = p;
    }

    return PagedResponse<Product>(
      items: products,
      page: response.page,
      pageSize: response.pageSize,
      totalCount: response.totalCount,
    );
  }

  ///  TEK ÜRÜN (CACHE + API)
  Future<Product> getProductById(String id) async {
    /// ✅ önce cache kontrol
    if (_cache.containsKey(id)) {
      return _cache[id]!;
    }

    final json = await remoteDataSource.getProductById(id);
    final product = ProductModel.fromJson(json);

    _cache[id] = product;

    return product;
  }

  ///  LEGACY METHODLAR (UI kırılmasın diye)
  @override
  Future<List<Product>> getAllProducts() async {
    final response = await getFilteredProducts(page: 1);
    return response.items;
  }

  @override
  Future<List<Product>> getProductsByCategoryId(String id) async {
    final response = await getFilteredProducts(
      categoryId: id,
      page: 1,
    );
    return response.items;
  }

  @override
  Future<List<Product>> getProductsByBrand(int brand) async {
    final response = await getFilteredProducts(
      brand: brand,
      page: 1,
    );
    return response.items;
  }

  @override
  Future<List<Product>> getProductsByGender(
    int gender, {
    String? categoryId,
  }) async {
    final response = await getFilteredProducts(
      gender: gender,
      categoryId: categoryId,
      page: 1,
    );
    return response.items;
  }
}
