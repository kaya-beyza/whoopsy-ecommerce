import 'dart:convert';
import 'package:http/http.dart' as http;

class CategoryRemoteDataSource {
  final String baseUrl = "http://localhost:5277/api";

  Future<List<dynamic>> getAllCategories() async {
    final url = "$baseUrl/Categories";
    print("CATEGORY REQUEST: $url");

    final response = await http
        .get(Uri.parse(url))
        .timeout(const Duration(seconds: 5)); // 🔥 timeout ekledik

    print("CATEGORY STATUS: ${response.statusCode}");
    print("CATEGORY BODY: ${response.body}");

    if (response.statusCode == 200) {
      final decoded = json.decode(response.body);

      // 🔥 BURASI ÇOK KRİTİK
      if (decoded is List) {
        return decoded;
      } else if (decoded is Map && decoded.containsKey('data')) {
        return decoded['data'];
      } else {
        throw Exception("Beklenmeyen response formatı");
      }
    } else {
      throw Exception("Kategori hatası: ${response.statusCode}");
    }
  }
}
