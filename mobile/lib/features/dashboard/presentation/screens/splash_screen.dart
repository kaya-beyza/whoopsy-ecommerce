import 'dart:async';
import 'package:flutter/material.dart';
import 'package:mobile/core/navigation/main_screen.dart';
import 'package:mobile/core/widgets/whoopsy_logo.dart';
import 'package:mobile/features/auth/data/datasources/auth_local_data_source.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();

    Future.microtask(() async {
      await AuthLocalDataSource().tryAutoLogin(context);

      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const MainScreen()),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: WhoopsyLogo(size: 70), // 🔥 BÜYÜK LOGO
      ),
    );
  }
}
