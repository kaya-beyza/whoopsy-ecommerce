import 'dart:convert';
import 'package:http/http.dart' as http;

class ProductRemoteDataSource {
  // Buraya backend ekibinden aldığın IP adresini yazmalısın
  final String baseUrl = "http://localhost:5277/api";

  Future<List<dynamic>> getProductsByCategoryId(String categoryId) async {
    // Backend'deki [HttpGet("by-category/{categoryId}")] ucuna istek atıyoruz
    final response =
        await http.get(Uri.parse("$baseUrl/Products/by-category/$categoryId"));

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception("Backend ürünleri gönderemedi: ${response.statusCode}");
    }
  }
}
