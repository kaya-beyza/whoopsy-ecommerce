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

  Future<List<dynamic>> getFilteredProducts({
    int? gender,
    int? brand,
    String? categoryId,
    String? searchTerm,
    int page = 1,
    int pageSize = 20,
  }) async {
    final query = <String, String>{};

    if (gender != null) query["gender"] = gender.toString();
    if (brand != null) query["brand"] = brand.toString();
    if (categoryId != null && categoryId.isNotEmpty) {
      query["categoryId"] = categoryId;
    }
    if (searchTerm != null && searchTerm.isNotEmpty) {
      query["searchTerm"] = searchTerm;
    }

    query["page"] = page.toString();
    query["pageSize"] = pageSize.toString();

    final uri =
        Uri.parse("$baseUrl/Products/filter").replace(queryParameters: query);

    print("FILTER URL: $uri");

    final response = await http.get(uri);

    print("STATUS: ${response.statusCode}");
    print("BODY: ${response.body}");

    if (response.statusCode == 200) {
      final decoded = jsonDecode(response.body);

      if (decoded is List) {
        return decoded;
      }

      if (decoded is Map<String, dynamic> && decoded.containsKey("data")) {
        return decoded["data"] as List<dynamic>;
      }

      throw Exception("Beklenmeyen response formatı");
    } else {
      throw Exception("Filter failed");
    }
  }

  Future<List<dynamic>> getProductsByBrand(int brand) async {
    final url = "$baseUrl/Products/by-brand?brand=$brand&page=1&pageSize=100";

    print("BRAND REQUEST: $url");

    final response = await http.get(Uri.parse(url));

    print("STATUS: ${response.statusCode}");
    print("BODY: ${response.body}");

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception("Brand fetch failed");
    }
  }
}
