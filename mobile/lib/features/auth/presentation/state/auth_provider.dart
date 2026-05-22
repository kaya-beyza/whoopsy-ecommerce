import 'package:flutter/material.dart';
import 'package:mobile/features/auth/data/datasources/auth_local_data_source.dart';

class AuthProvider extends ChangeNotifier {
  String? token;
  String? name;
  String? email;

  bool get isAuthenticated => token != null;

  Future<void> logout() async {
    await AuthLocalDataSource().clear();

    token = null;
    name = null;
    email = null;

    notifyListeners();
  }

  void login({
    required String newToken,
    required String userName,
    required String userEmail,
  }) {
    token = newToken;
    name = userName;
    email = userEmail;

    notifyListeners();
  }
}
