import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:mobile/features/products/domain/models/paged_response.dart';

class ProductRemoteDataSource {
  final String baseUrl = "http://localhost:5277/api";

  PagedResponse<dynamic> _parsePagedResponse(String body) {
    final decoded = jsonDecode(body);

    if (decoded is Map<String, dynamic>) {
      return PagedResponse(
        items: decoded["items"] ?? [],
        page: decoded["page"] ?? 1,
        pageSize: decoded["pageSize"] ?? 20,
        totalCount: decoded["totalCount"] ?? 0,
      );
    }

    /// fallback (eski endpointler)
    if (decoded is List) {
      return PagedResponse(
        items: decoded,
        page: 1,
        pageSize: decoded.length,
        totalCount: decoded.length,
      );
    }

    throw Exception("Beklenmeyen response formatı");
  }

  Future<PagedResponse<dynamic>> getFilteredProducts({
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

    final response = await http.get(uri);

    if (response.statusCode == 200) {
      return _parsePagedResponse(response.body);
    } else {
      throw Exception("Filter failed");
    }
  }

  Future<Map<String, dynamic>> getProductById(String id) async {
    final url = "$baseUrl/Products/$id";

    print("PRODUCT DETAIL REQUEST: $url");

    final response = await http.get(Uri.parse(url));

    print("STATUS: ${response.statusCode}");
    print("BODY: ${response.body}");

    if (response.statusCode == 200) {
      final decoded = jsonDecode(response.body);

      if (decoded is Map<String, dynamic>) {
        return decoded;
      }

      if (decoded is Map<String, dynamic> && decoded.containsKey("data")) {
        return decoded["data"];
      }

      throw Exception("Beklenmeyen ürün formatı");
    } else {
      throw Exception("Ürün bulunamadı");
    }
  }
}
