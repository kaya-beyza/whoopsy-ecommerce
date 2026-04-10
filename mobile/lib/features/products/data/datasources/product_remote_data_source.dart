import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:mobile/features/products/domain/entities/product.dart';

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

  Future<List<dynamic>> getAllProducts() async {
    final response = await http.get(Uri.parse("$baseUrl/Products"));

    if (response.statusCode == 200) {
      return json.decode(response.body); // ✅ JSON
    } else {
      throw Exception();
    }
  }

  Future<List<dynamic>> getProductsByGender(int gender,
      {String? categoryId}) async {
    final url = categoryId != null
        ? "$baseUrl/Products/by-gender?gender=$gender&categoryId=$categoryId"
        : "$baseUrl/Products/by-gender?gender=$gender";

    print("REQUEST: $url");

    final response = await http.get(Uri.parse(url));

    print("STATUS: ${response.statusCode}");
    print("BODY: ${response.body}");

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception("Ürünler alınamadı");
    }
  }
}
