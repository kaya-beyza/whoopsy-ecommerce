import 'package:flutter/material.dart';
import 'package:mobile/features/auth/data/datasources/auth_local_data_source.dart';
import 'package:mobile/features/dashboard/data/datasources/favorite_remote_data_source.dart';
import 'package:mobile/features/dashboard/data/repositories/favorite_repository_impl.dart';
import 'package:mobile/features/products/domain/entities/product.dart';

class FavoriteService extends ChangeNotifier {
  final FavoriteRemoteDataSource remote = FavoriteRemoteDataSource();
  final AuthLocalDataSource local = AuthLocalDataSource();

  late final FavoriteRepositoryImpl _repo = FavoriteRepositoryImpl(remote);

  final Set<String> _favoriteIds = {};

  List<Product> _products = [];

  bool _loading = false;

  bool get loading => _loading;

  List<Product> get products => _products;

  bool isFavorite(String productId) {
    return _favoriteIds.contains(productId);
  }

  Future<void> loadFavorites() async {
    try {
      _loading = true;
      notifyListeners();

      final userId = await local.getUserId();

      if (userId == null || userId.isEmpty) {
        _products = [];
        return;
      }

      final data = await _repo.getUserFavorites(userId);

      _products = data;

      _favoriteIds.clear();

      _favoriteIds.addAll(
        data.map((e) => e.id),
      );
    } catch (e) {
      print("FAVORITES LOAD ERROR: $e");
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  Future<void> toggleFavorite(String productId) async {
    final userId = await local.getUserId();

    if (userId == null) {
      throw Exception("User yok");
    }

    if (_favoriteIds.contains(productId)) {
      await remote.removeFavorite(userId, productId);

      _favoriteIds.remove(productId);

      _products.removeWhere((x) => x.id == productId);
    } else {
      await remote.addFavorite(userId, productId);

      await loadFavorites();
    }

    notifyListeners();
  }
}
