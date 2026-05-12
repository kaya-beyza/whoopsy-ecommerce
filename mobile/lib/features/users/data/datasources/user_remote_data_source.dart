import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/user_model.dart';
import 'package:mobile/features/auth/data/datasources/auth_local_data_source.dart';

class UserRemoteDataSource {
  final String baseUrl = "http://localhost:5277/api";
  final AuthLocalDataSource local = AuthLocalDataSource();

  Future<UserModel> getUser({
    required String userId,
    required String token,
  }) async {
    final response = await http.get(
      Uri.parse("$baseUrl/users/$userId"),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token",
      },
    );

    if (response.statusCode == 200) {
      return UserModel.fromJson(json.decode(response.body));
    } else {
      throw Exception("Failed to fetch user");
    }
  }

  Future<void> updateProfile({
    required String fullName,
    required String phoneNumber,
    required String address,
    required String birthDate,
  }) async {
    final token = await local.getToken();
    print("TOKEN UPDATE: $token");
    final response = await http.put(
      Uri.parse("$baseUrl/users/me"),
      headers: {
        "Authorization": "Bearer $token",
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: jsonEncode({
        "fullName": fullName,
        "phoneNumber": "+90$phoneNumber",
        "address": address,
        "birthDate": birthDate,
      }),
    );

    print("UPDATE PROFILE STATUS: ${response.statusCode}");
    print("UPDATE PROFILE BODY: ${response.body}");
    print("UPDATE URL: $baseUrl/users/me");
    if (response.statusCode != 200) {
      throw Exception("Profil güncellenemedi");
    }
  }
}
