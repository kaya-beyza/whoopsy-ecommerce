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

  Future<String?> getToken() async {
    return await storage.read(key: 'accessToken');
  }

  Future<void> clear() async {
    await storage.deleteAll();
  }

  Future<void> tryAutoLogin(BuildContext context) async {
    final token = await getToken();

    if (token != null) {
      //  JWT DECODE EKLE
      final decoded = JwtDecoder.decode(token);

      final name =
          decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

      final email = decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];

      context.read<AuthProvider>().login(
            newToken: token,
            userName: name,
            userEmail: email,
          );
    }
  }
}
