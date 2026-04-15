import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:jwt_decoder/jwt_decoder.dart';
import 'package:mobile/features/auth/presentation/state/auth_provider.dart';
import 'package:provider/provider.dart';

class AuthLocalDataSource {
  final storage = const FlutterSecureStorage();

  Future<void> saveToken(String token) async {
    await storage.write(key: 'accessToken', value: token);
  }

  Future<void> saveUser({
    required String token,
    required String name,
    required String email,
  }) async {
    await storage.write(key: 'accessToken', value: token);
    await storage.write(key: 'name', value: name);
    await storage.write(key: 'email', value: email);
  }

  Future<String?> getToken() async {
    return await storage.read(key: 'accessToken');
  }

  Future<void> clear() async {
    await storage.deleteAll();
  }

  Future<void> tryAutoLogin(BuildContext context) async {
    final token = await storage.read(key: 'accessToken');

    if (token == null || token.isEmpty) return;

    final savedName = await storage.read(key: 'name');
    final savedEmail = await storage.read(key: 'email');

    /// 🔥 fallback decode
    String name = savedName ?? "";
    String email = savedEmail ?? "";

    if (name.isEmpty || email.isEmpty) {
      try {
        final decoded = JwtDecoder.decode(token);

        name = decoded[
                "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ??
            "";

        email = decoded[
                "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ??
            "";
      } catch (e) {
        print("DECODE ERROR: $e");
      }
    }

    context.read<AuthProvider>().login(
          newToken: token,
          userName: name,
          userEmail: email,
        );
  }
}
