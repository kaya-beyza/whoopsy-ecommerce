import 'package:mobile/features/products/domain/entities/product.dart';
import 'package:mobile/features/products/data/models/product_model.dart';
import '../datasources/favorite_remote_data_source.dart';

class FavoriteRepositoryImpl {
  final FavoriteRemoteDataSource remote;

  FavoriteRepositoryImpl(this.remote);

  Future<List<Product>> getUserFavorites(String userId) async {
    final data = await remote.getUserFavorites(userId);

    return data.map<Product>((e) {
      return ProductModel(
        id: e["productId"],
        name: e["productName"],
        description: "",
        price: (e["price"] as num).toDouble(),
        stockQuantity: 0,
        categoryId: "",
        brand: 0,
        gender: 0,
        mainImageUrl: e["mainImageUrl"],
        imageUrls: [],
      );
    }).toList();
  }
}
