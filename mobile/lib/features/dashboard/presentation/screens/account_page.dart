import 'package:flutter/material.dart';
import 'package:mobile/features/auth/presentation/state/auth_provider.dart';
import 'package:mobile/features/dashboard/presentation/screens/orders_page.dart';
import 'package:mobile/features/users/presentation/profile_page.dart';
import 'package:provider/provider.dart';

class AccountPage extends StatelessWidget {
  const AccountPage({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 20),

            /// 👤 HEADER
            Text(
              "MERHABA, ${auth.name ?? "KULLANICI"}",
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 5),
            Text(
              auth.email ?? "",
              style: TextStyle(color: Colors.grey),
            ),

            const SizedBox(height: 30),

            /// 📦 MENU
            _buildMenuItem(
              Icons.shopping_bag,
              "SİPARİŞLERİM",
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => const OrdersPage(),
                  ),
                );
              },
            ),
            _buildMenuItem(Icons.assignment_return, "İADELER"),

            _buildMenuItem(
              Icons.person,
              "BİLGİLERİM",
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => const ProfilePage(),
                  ),
                );
              },
            ),

            const Spacer(),

            /// 🚪 LOGOUT
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  context.read<AuthProvider>().logout();
                },
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: Colors.black26),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: const RoundedRectangleBorder(
                    borderRadius: BorderRadius.zero, // daha düz görünüm
                  ),
                ),
                child: const Text(
                  "OTURUMU KAPAT",
                  style: TextStyle(color: Color.fromARGB(255, 40, 40, 40)),
                ),
              ),
            ),

            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildMenuItem(
    IconData icon,
    String title, {
    VoidCallback? onTap,
  }) {
    return Column(
      children: [
        ListTile(
          contentPadding: EdgeInsets.zero,
          leading: Icon(icon, size: 22),
          title: Text(
            title,
            style: const TextStyle(fontSize: 14),
          ),
          trailing: const Icon(Icons.arrow_forward_ios, size: 14),
          onTap: onTap,
        ),
        const Divider(height: 1),
      ],
    );
  }
}
