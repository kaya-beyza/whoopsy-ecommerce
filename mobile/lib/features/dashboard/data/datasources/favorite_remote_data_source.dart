import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:mobile/features/auth/data/datasources/auth_local_data_source.dart';

class FavoriteRemoteDataSource {
  final String baseUrl = "http://localhost:5277/api";
  final AuthLocalDataSource local = AuthLocalDataSource();

  Future<List<dynamic>> getUserFavorites(String userId) async {
    final token = await local.getToken();

    final url = "$baseUrl/favorites/$userId";

    print("FAVORITES REQUEST: $url");

    final response = await http.get(
      Uri.parse(url),
      headers: {
        "Authorization": "Bearer $token",
        "Content-Type": "application/json",
      },
    );

    print("STATUS: ${response.statusCode}");
    print("BODY: ${response.body}");

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception("Favoriler alınamadı: ${response.body}");
    }
  }

  Future<void> addFavorite(String userId, String productId) async {
    final token = await local.getToken();

    final response = await http.post(
      Uri.parse("$baseUrl/favorites"),
      headers: {
        "Authorization": "Bearer $token",
        "Content-Type": "application/json",
      },
      body: jsonEncode({
        "userId": userId,
        "productId": productId,
      }),
    );

    if (response.statusCode != 200) {
      throw Exception("Favoriye eklenemedi");
    }
  }

  /// REMOVE
  Future<void> removeFavorite(String userId, String productId) async {
    final token = await local.getToken();

    final response = await http.delete(
      Uri.parse("$baseUrl/favorites"),
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
      throw Exception("Favoriden silinemedi");
    }
  }
}
