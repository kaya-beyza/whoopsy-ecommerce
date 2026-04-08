import 'package:flutter/material.dart';
import 'package:mobile/features/auth/presentation/state/auth_provider.dart';
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
              "MERHABA, ${auth.name ?? "KULLANICI"}!",
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 5),
            Text(
              auth.email ?? "",
              style: TextStyle(color: Colors.grey),
            ),

            const SizedBox(height: 30),

            /// 📦 MENU
            _buildMenuItem(Icons.shopping_bag, "SİPARİŞLERİM"),
            _buildMenuItem(Icons.assignment_return, "İADELER"),
            _buildMenuItem(Icons.credit_card, "ÖDEME YÖNTEMLERİ"),
            _buildMenuItem(Icons.person, "BİLGİLERİM"),

            const Spacer(),

            /// 🚪 LOGOUT
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  context.read<AuthProvider>().logout();
                },
                child: const Text("OTURUMU KAPAT"),
              ),
            ),

            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildMenuItem(IconData icon, String title) {
    return Card(
      elevation: 2,
      child: ListTile(
        leading: Icon(icon),
        title: Text(title),
        trailing: const Icon(Icons.arrow_forward_ios, size: 16),
        onTap: () {},
      ),
    );
  }
}
