import 'dart:convert';
import 'package:http/http.dart' as http;

class AuthRemoteDataSource {
   final String baseUrl = "http://localhost:5277/api";

  Future<String> login(String email, String password) async {
    final response = await http.post(
      Uri.parse("$baseUrl/Auth/login"),
      headers: {"Content-Type": "application/json"},
      body: json.encode({
        "email": email,
        "password": password,
      }),
    );

    print("LOGIN RESPONSE: ${response.body}");

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return data['accessToken'];
    } else {
      throw Exception("Login failed: ${response.body}");
    }
  }

  Future<String> register(
      String fullName, String email, String password) async {
    final response = await http.post(
      Uri.parse("$baseUrl/Auth/register"),
      headers: {"Content-Type": "application/json"},
      body: json.encode({
        "fullName": fullName,
        "email": email,
        "password": password,
      }),
    );

    print("REGISTER RESPONSE: ${response.body}");

    if (response.statusCode == 200) {
      return response.body; // string dönüyor
    } else {
      throw Exception("Register failed: ${response.body}");
    }
  }
}