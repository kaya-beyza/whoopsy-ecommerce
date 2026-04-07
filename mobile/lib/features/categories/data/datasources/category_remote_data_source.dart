import 'dart:convert';
import 'package:http/http.dart' as http;

class CategoryRemoteDataSource {
  final String baseUrl =
      "http://localhost:5277/api"; // Backend IP'ni buraya yaz

  Future<List<dynamic>> getAllCategories() async {
    final response = await http.get(Uri.parse("$baseUrl/Categories"));

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception("Kategoriler backend'den çekilemedi");
    }
  }
}
