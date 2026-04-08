import 'package:flutter/material.dart';

class AuthProvider extends ChangeNotifier {
  String? token;
  String? name;
  String? email;

  bool get isLoggedIn => token != null;

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

  void logout() {
    token = null;
    name = null;
    email = null;

    notifyListeners();
  }
}
