import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
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
      context.read<AuthProvider>().login(
            newToken: token,
            userName: "User", // sonra JWT decode edeceğiz
            userEmail: "",
          );
    }
  }
}
