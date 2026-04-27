import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:mobile/features/auth/presentation/state/auth_provider.dart';
import 'package:mobile/features/dashboard/presentation/screens/account_page.dart';
import 'package:mobile/features/auth/presentation/pages/login_page.dart';

class ProfileWrapper extends StatelessWidget {
  const ProfileWrapper({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);

    if (auth.isLoggedIn) {
      return const AccountPage();
    } else {
      return const LoginPage();
    }
  }
}
