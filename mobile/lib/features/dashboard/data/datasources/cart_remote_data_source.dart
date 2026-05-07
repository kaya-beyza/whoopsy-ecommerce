import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:mobile/features/auth/data/datasources/auth_local_data_source.dart';

class CartRemoteDataSource {
  final String baseUrl = "http://localhost:5277/api";
  final AuthLocalDataSource local = AuthLocalDataSource();

  Future<List<dynamic>> getUserCart(String userId) async {
    final token = await local.getToken();

    final response = await http.get(
      Uri.parse("$baseUrl/cart/$userId"),
      headers: {
        "Authorization": "Bearer $token",
        "Content-Type": "application/json",
      },
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception("Sepet alınamadı");
    }
  }

  Future<void> addToCart(String userId, String productId, int quantity) async {
    final token = await local.getToken();

    final response = await http.post(
      Uri.parse("$baseUrl/cart"),
      headers: {
        "Authorization": "Bearer $token",
        "Content-Type": "application/json",
      },
      body: jsonEncode({
        "userId": userId,
        "productId": productId,
        "quantity": quantity,
      }),
    );

    if (response.statusCode != 200) {
      throw Exception("Sepete eklenemedi: ${response.body}");
    }
  }

  Future<void> updateQuantity(
      String userId, String productId, int quantity) async {
    final token = await local.getToken();

    final response = await http.put(
      Uri.parse("$baseUrl/cart"),
      headers: {
        "Authorization": "Bearer $token",
        "Content-Type": "application/json",
      },
      body: jsonEncode({
        "userId": userId,
        "productId": productId,
        "quantity": quantity,
      }),
    );

    if (response.statusCode != 204) {
      throw Exception("Güncellenemedi");
    }
  }

  Future<void> removeItem(String userId, String productId) async {
    final token = await local.getToken();

    final response = await http.delete(
      Uri.parse("$baseUrl/cart"),
      headers: {
        "Authorization": "Bearer $token",
        "Content-Type": "application/json",
      },
      body: jsonEncode({
        "userId": userId,
        "productId": productId,
      }),
    );

    if (response.statusCode != 204) {
      throw Exception("Silinemedi");
    }
  }
}
