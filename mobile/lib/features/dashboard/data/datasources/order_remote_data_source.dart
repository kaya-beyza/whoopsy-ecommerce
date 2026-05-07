import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:mobile/features/auth/data/datasources/auth_local_data_source.dart';

String extractUserId(String token) {
  final parts = token.split('.');
  final payload = utf8.decode(base64Url.decode(base64Url.normalize(parts[1])));
  final map = jsonDecode(payload);

  return map[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
}

class OrderRemoteDataSource {
  final String baseUrl = "http://localhost:5277/api";
  final AuthLocalDataSource local = AuthLocalDataSource();

  /// 🔹 COMMON HEADER
  Future<Map<String, String>> _getHeaders() async {
    final token = await local.getToken();
    print("TOKEN: $token");
    if (token == null || token.isEmpty) {
      throw Exception("Token bulunamadı");
    }

    return {
      "Authorization": "Bearer $token",
      "Content-Type": "application/json",
    };
  }

  /// 🔹 GET ORDERS (PAGINATED)
  Future<List<dynamic>> getOrders(String userId) async {
    final headers = await _getHeaders();

    final response = await http.get(
      Uri.parse("$baseUrl/Users/$userId/orders"),
      headers: headers,
    );

    print("ORDERS STATUS: ${response.statusCode}");
    print("ORDERS BODY: ${response.body}");

    if (response.statusCode == 200) {
      final decoded = jsonDecode(response.body);

      if (decoded is List) {
        return decoded;
      }

      throw Exception("Response list değil");
    }

    throw Exception("Siparişler alınamadı (${response.statusCode})");
  }

  /// 🔹 DETAIL (ORDER BY ID)
  Future<Map<String, dynamic>> getOrderDetail(String orderId) async {
    final headers = await _getHeaders();

    final response = await http.get(
      Uri.parse("$baseUrl/Orders/$orderId"),
      headers: headers,
    );

    print("DETAIL STATUS: ${response.statusCode}");
    print("DETAIL BODY: ${response.body}");

    if (response.statusCode == 200) {
      final decoded = jsonDecode(response.body);

      if (decoded is Map<String, dynamic>) return decoded;
      throw Exception("Map değil");
    }

    throw Exception("Detail alınamadı (${response.statusCode})");
  }
}
