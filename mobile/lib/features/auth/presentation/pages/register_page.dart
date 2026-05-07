import 'package:flutter/material.dart';
import 'package:jwt_decoder/jwt_decoder.dart';
import 'package:mobile/core/navigation/main_screen.dart';
import 'package:mobile/features/auth/data/datasources/auth_local_data_source.dart';
import 'package:mobile/features/auth/data/datasources/auth_remote_data_source.dart';
import 'package:mobile/features/auth/presentation/state/auth_provider.dart';
import 'package:provider/provider.dart';

class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  bool isPasswordVisible = false;

  final TextEditingController nameController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

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
          "KAYIT OL",
          style: TextStyle(color: Colors.black),
        ),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: SingleChildScrollView(
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
                  "HESAP OLUŞTUR",
                  style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                  ),
                ),

                const SizedBox(height: 20),

                /// NAME
                TextField(
                  controller: nameController,
                  decoration: const InputDecoration(
                    labelText: "AD SOYAD",
                    border: OutlineInputBorder(),
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
                        isPasswordVisible
                            ? Icons.visibility
                            : Icons.visibility_off,
                      ),
                      onPressed: () {
                        setState(() {
                          isPasswordVisible = !isPasswordVisible;
                        });
                      },
                    ),
                  ),
                ),

                const SizedBox(height: 30),

                /// REGISTER BUTTON
                SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.black,
                    ),
                    onPressed: () async {
                      final fullName = nameController.text;
                      final email = emailController.text;
                      final password = passwordController.text;

                      if (fullName.isEmpty ||
                          email.isEmpty ||
                          password.isEmpty) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                              content: Text("Lütfen tüm alanları doldurun")),
                        );
                        return;
                      }

                      try {
                        final remote = AuthRemoteDataSource();
                        final local = AuthLocalDataSource();

                        ///  1. REGISTER
                        await remote.register(fullName, email, password);

                        ///  2. LOGIN (KRİTİK)
                        final token = await remote.login(email, password);

                        print("REGISTER LOGIN TOKEN: $token");

                        ///  3. JWT DECODE
                        final decoded = JwtDecoder.decode(token);

                        final userId = decoded[
                            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

                        final name = decoded[
                                "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ??
                            fullName;

                        final emailFromToken = decoded[
                                "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ??
                            email;

                        ///  4. SAVE
                        await local.saveUser(
                          token: token,
                          userId: userId,
                          name: name,
                          email: emailFromToken,
                        );

                        ///  5. PROVIDER
                        context.read<AuthProvider>().login(
                              newToken: token,
                              userName: name,
                              userEmail: emailFromToken,
                            );

                        ///  6. ANA SAYFAYA GİT
                        Navigator.pushAndRemoveUntil(
                          context,
                          MaterialPageRoute(builder: (_) => const MainScreen()),
                          (route) => false,
                        );
                      } catch (e) {
                        print("REGISTER ERROR: $e");

                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text("Kayıt başarısız")),
                        );
                      }
                    },
                    child: const Text(
                      "KAYIT OL",
                      style: TextStyle(color: Colors.white),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
