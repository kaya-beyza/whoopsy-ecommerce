import 'package:flutter/material.dart';
import 'package:mobile/features/dashboard/data/datasources/cart_remote_data_source.dart';
import 'package:mobile/features/auth/data/datasources/auth_local_data_source.dart';

class CartService extends ChangeNotifier {
  final CartRemoteDataSource remote = CartRemoteDataSource();
  final AuthLocalDataSource local = AuthLocalDataSource();

  Future<void> addToCart(String productId) async {
    final userId = await local.getUserId();

    if (userId == null) {
      throw Exception("User yok");
    }

    await remote.addToCart(userId, productId, 1);
  }
}
