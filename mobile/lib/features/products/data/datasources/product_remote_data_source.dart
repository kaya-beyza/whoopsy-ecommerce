import 'dart:convert';
import 'package:http/http.dart' as http;

class ProductRemoteDataSource {
  final String baseUrl = "http://localhost:5277/api";

  Future<List<dynamic>> getProductsByCategoryId(String categoryId) async {
    final url = "$baseUrl/Products/by-category/$categoryId";
    print("PRODUCT REQUEST: $url");

    final response = await http.get(Uri.parse(url));

    print("PRODUCT STATUS: ${response.statusCode}");
    print("PRODUCT BODY: ${response.body}");

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception("Ürünler alınamadı");
    }
  }
}
