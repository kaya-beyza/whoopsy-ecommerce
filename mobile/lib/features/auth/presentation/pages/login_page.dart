import 'package:flutter/material.dart';
import 'package:mobile/core/navigation/main_screen.dart';
import 'package:mobile/features/auth/presentation/pages/register_page.dart';
import 'package:provider/provider.dart';
import 'package:jwt_decoder/jwt_decoder.dart';

import '../../data/datasources/auth_remote_data_source.dart';
import '../../data/datasources/auth_local_data_source.dart';
import '../state/auth_provider.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  bool isPasswordVisible = false;
  bool isLoading = false;

  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  @override
  void dispose() {
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  Future<void> handleLogin() async {
    final email = emailController.text.trim();
    final password = passwordController.text.trim();

    if (email.isEmpty || password.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Tüm alanları doldurun")),
      );
      return;
    }

    setState(() => isLoading = true);

    try {
      final remote = AuthRemoteDataSource();
      final local = AuthLocalDataSource();

      //  API CALL
      final token = await remote.login(email, password);

      print("TOKEN: $token");

      //  JWT DECODE
      final decoded = JwtDecoder.decode(token);

      final name = decoded[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ??
          "User";

      final emailFromToken = decoded[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ??
          email;
      final userId = decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

      await local.saveUser(
        token: token,
        userId: userId,
        name: name,
        email: emailFromToken,
      );
      print("NAME: $name");

      //  PROVIDER UPDATE
      context.read<AuthProvider>().login(
            newToken: token,
            userName: name,
            userEmail: emailFromToken,
          );

      // 🚀 NAVIGATION
      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (_) => const MainScreen()),
        (route) => false,
      );
    } catch (e) {
      print("LOGIN ERROR: $e");

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Giriş başarısız")),
      );
    } finally {
      setState(() => isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: true,
      backgroundColor: Colors.white,
      appBar: AppBar(
        leading: const BackButton(color: Colors.black),
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        title: const Text(
          "OTURUM AÇ",
          style: TextStyle(color: Colors.black),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 20),

            const Text(
              "WHOOPSY",
              style: TextStyle(
                fontSize: 34,
                fontWeight: FontWeight.bold,
              ),
            ),

            const SizedBox(height: 30),

            const Text(
              "OTURUM AÇ",
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
              ),
            ),

            const SizedBox(height: 20),

            /// EMAIL
            TextField(
              controller: emailController,
              decoration: const InputDecoration(
                labelText: "E-POSTA",
                border: OutlineInputBorder(),
              ),
            ),

            const SizedBox(height: 20),

            /// PASSWORD
            TextField(
              controller: passwordController,
              obscureText: !isPasswordVisible,
              decoration: InputDecoration(
                labelText: "ŞİFRE",
                border: const OutlineInputBorder(),
                suffixIcon: IconButton(
                  icon: Icon(
                    isPasswordVisible ? Icons.visibility : Icons.visibility_off,
                  ),
                  onPressed: () {
                    setState(() {
                      isPasswordVisible = !isPasswordVisible;
                    });
                  },
                ),
              ),
            ),

            const SizedBox(height: 20),

            const Text(
              "PAROLANI MI UNUTTUN?",
              style: TextStyle(fontWeight: FontWeight.w500),
            ),

            const SizedBox(height: 20),

            /// LOGIN BUTTON
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.black,
                ),
                onPressed: isLoading ? null : handleLogin,
                child: isLoading
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text(
                        "OTURUM AÇ",
                        style: TextStyle(color: Colors.white),
                      ),
              ),
            ),

            const SizedBox(height: 20),

            Center(
              child: GestureDetector(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => const RegisterPage(),
                    ),
                  );
                },
                child: const Text.rich(
                  TextSpan(
                    children: [
                      TextSpan(text: "HESABIN YOK MU? "),
                      TextSpan(
                        text: "KAYIT OL",
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
