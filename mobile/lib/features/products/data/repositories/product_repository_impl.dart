import 'package:mobile/features/products/domain/entities/product.dart';
import 'package:mobile/features/products/domain/models/paged_response.dart';
import '../../domain/repositories/product_repository.dart';
import '../models/product_model.dart';
import '../datasources/product_remote_data_source.dart';

class ProductRepositoryImpl implements IProductRepository {
  final ProductRemoteDataSource remoteDataSource;

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

    return PagedResponse<Product>(
      items: response.items.map((e) => ProductModel.fromJson(e)).toList(),
      page: response.page,
      pageSize: response.pageSize,
      totalCount: response.totalCount,
    );
  }

  ///  LEGACY DESTEK (UI bozulmasın diye)
  @override
  Future<List<Product>> getAllProducts() async {
    final response = await remoteDataSource.getFilteredProducts(page: 1);

    return response.items.map((e) => ProductModel.fromJson(e)).toList();
  }

  @override
  Future<List<Product>> getProductsByCategoryId(String id) async {
    final response = await remoteDataSource.getFilteredProducts(
      categoryId: id,
      page: 1,
    );

    return response.items.map((e) => ProductModel.fromJson(e)).toList();
  }

  @override
  Future<List<Product>> getProductsByBrand(int brand) async {
    final response = await remoteDataSource.getFilteredProducts(
      brand: brand,
      page: 1,
    );

    return response.items.map((e) => ProductModel.fromJson(e)).toList();
  }

  @override
  Future<List<Product>> getProductsByGender(
    int gender, {
    String? categoryId,
  }) async {
    final response = await remoteDataSource.getFilteredProducts(
      gender: gender,
      categoryId: categoryId,
      page: 1,
    );

    return response.items.map((e) => ProductModel.fromJson(e)).toList();
  }
}
