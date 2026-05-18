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
    print("REQUEST URL: $baseUrl/Users/$userId/orders");
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

  Future<void> updateOrderStatus({
    required String orderId,
    required String status,
  }) async {
    final headers = await _getHeaders();

    final response = await http.put(
      Uri.parse("$baseUrl/orders/$orderId/status"),
      headers: headers,
      body: jsonEncode({
        "newStatus": status,
      }),
    );

    print("UPDATE STATUS: ${response.statusCode}");
    print("UPDATE BODY: ${response.body}");

    if (response.statusCode != 200 && response.statusCode != 204) {
      throw Exception("Status update failed");
    }
  }

  /// PAYMENT
  Future<void> createPayment({
    required String orderId,
    required String cardHolderName,
    required String cardNumber,
    required String expireMonth,
    required String expireYear,
    required String cvc,
    required String buyerName,
    required String buyerSurname,
    required String buyerEmail,
    required String buyerPhone,
    required String buyerAddress,
    required String buyerCity,
  }) async {
    final headers = await _getHeaders();

    final response = await http.post(
      Uri.parse("$baseUrl/payments"),
      headers: headers,
      body: jsonEncode({
        "orderId": orderId,
        "cardHolderName": cardHolderName,
        "cardNumber": cardNumber,
        "expireMonth": expireMonth,
        "expireYear": expireYear,
        "cvc": cvc,
        "buyerName": buyerName,
        "buyerSurname": buyerSurname,
        "buyerEmail": buyerEmail,
        "buyerPhone": buyerPhone,
        "buyerAddress": buyerAddress,
        "buyerCity": buyerCity,
      }),
    );

    print("PAYMENT STATUS: ${response.statusCode}");
    print("PAYMENT BODY: ${response.body}");

    if (response.statusCode != 200 && response.statusCode != 201) {
      throw Exception("Ödeme başarısız");
    }
  }
}
