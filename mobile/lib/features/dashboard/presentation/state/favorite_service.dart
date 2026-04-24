import 'package:flutter/material.dart';
import 'package:mobile/features/auth/data/datasources/auth_local_data_source.dart';
import 'package:mobile/features/dashboard/data/datasources/favorite_remote_data_source.dart';

class FavoriteService extends ChangeNotifier {
  final FavoriteRemoteDataSource remote = FavoriteRemoteDataSource();
  final AuthLocalDataSource local = AuthLocalDataSource();

  /// memory cache
  final Set<String> _favoriteIds = {};

  bool isFavorite(String productId) {
    return _favoriteIds.contains(productId);
  }

  Future<void> toggleFavorite(String productId) async {
    final userId = await local.getUserId();

    if (userId == null) {
      throw Exception("User yok");
    }

    if (_favoriteIds.contains(productId)) {
      /// REMOVE
      await remote.removeFavorite(userId, productId);
      _favoriteIds.remove(productId);
    } else {
      /// ADD
      await remote.addFavorite(userId, productId);
      _favoriteIds.add(productId);
    }

    notifyListeners();
  }

  /// initial load (favorites page açıldığında)
  void setFavorites(List<String> productIds) {
    _favoriteIds.clear();
    _favoriteIds.addAll(productIds);
    notifyListeners();
  }
}
