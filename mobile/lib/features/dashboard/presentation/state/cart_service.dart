import 'package:flutter/material.dart';
import 'package:mobile/features/auth/data/datasources/auth_local_data_source.dart';
import 'package:mobile/features/dashboard/data/datasources/cart_remote_data_source.dart';

class CartService extends ChangeNotifier {
  final CartRemoteDataSource _remote = CartRemoteDataSource();
  final AuthLocalDataSource _local = AuthLocalDataSource();

  List<dynamic> _items = [];

  List<dynamic> get items => _items;

  bool _loading = false;

  bool get loading => _loading;

  int get totalPrice {
    return _items.fold(
      0,
      (sum, item) => sum + (item["totalPrice"] as num).toInt(),
    );
  }

  int get itemCount => _items.length;

  Future<void> loadCart() async {
    try {
      _loading = true;
      notifyListeners();

      final userId = await _local.getUserId();

      if (userId == null) {
        _items = [];
        return;
      }

      final data = await _remote.getUserCart(userId);

      _items = data;
    } catch (e) {
      print("CART LOAD ERROR: $e");
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  Future<void> addToCart(String productId) async {
    final userId = await _local.getUserId();

    if (userId == null) return;

    await _remote.addToCart(
      userId,
      productId,
      1,
    );

    await loadCart();
  }

  Future<void> updateQuantity(
    String productId,
    int quantity,
  ) async {
    final userId = await _local.getUserId();

    if (userId == null) return;

    await _remote.updateQuantity(
      userId,
      productId,
      quantity,
    );

    await loadCart();
  }

  Future<void> removeItem(String productId) async {
    final userId = await _local.getUserId();

    if (userId == null) return;

    await _remote.removeItem(
      userId,
      productId,
    );

    await loadCart();
  }

  Future<void> clearCart() async {
    final userId = await _local.getUserId();

    if (userId == null) return;

    await _remote.clearCart(userId);

    _items = [];

    notifyListeners();
  }
}
