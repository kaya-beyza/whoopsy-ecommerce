import 'package:flutter/material.dart';

class FooterSection extends StatelessWidget {
  const FooterSection({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 32, horizontal: 24),
      decoration: BoxDecoration(
        color: Colors.grey[50], // Çok hafif bir arka plan rengi fark yaratır
        border: Border(
          top: BorderSide(color: Colors.grey[200]!, width: 1),
        ),
      ),
      child: Column(
        children: [
          // Logo veya Uygulama İsmi (Opsiyonel)
          Text(
            "MOBİL MAĞAZA",
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w900,
              color: Colors.grey[800],
              letterSpacing: 2,
            ),
          ),
          const SizedBox(height: 24),

          // Linklerin Yatay Dizilimi (Profesyonel görünüm için Wrap kullanıyoruz)
          Wrap(
            alignment: WrapAlignment.center,
            spacing: 20, // Yatay boşluk
            runSpacing: 12, // Dikey boşluk (taşarsa alt satıra geçer)
            children: [
              _buildFooterLink(context, "Şartlar"),
              _buildFooterSeparator(),
              _buildFooterLink(context, "Gizlilik"),
              _buildFooterSeparator(),
              _buildFooterLink(context, "İade"),
              _buildFooterSeparator(),
              _buildFooterLink(context, "İletişim"),
            ],
          ),

          const SizedBox(height: 32),

          // Sosyal Medya İkonları
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              _buildSocialIcon(Icons.facebook),
              const SizedBox(width: 20),
              _buildSocialIcon(Icons.camera_alt_outlined), // Instagram temsili
              const SizedBox(width: 20),
              _buildSocialIcon(Icons.language), // Web sitesi temsili
            ],
          ),

          const SizedBox(height: 32),

          // Telif Hakkı Yazısı
          Text(
            "© 2026 Tüm Hakları Saklıdır.\nVersion 1.0.2",
            textAlign: TextAlign.center,
            style: TextStyle(
              color: Colors.grey[500],
              fontSize: 11,
              height: 1.5,
            ),
          ),
          const SizedBox(height: 10),
        ],
      ),
    );
  }

  // Modern, ince bir ayırıcı nokta
  Widget _buildFooterSeparator() {
    return Text(
      "•",
      style: TextStyle(color: Colors.grey[300], fontSize: 14),
    );
  }

  // Tıklanabilir link yapısı
  Widget _buildFooterLink(BuildContext context, String title) {
    return InkWell(
      onTap: () {},
      child: Text(
        title,
        style: TextStyle(
          color: Colors.grey[700],
          fontSize: 13,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }

  // Sosyal medya ikonu tasarımı
  Widget _buildSocialIcon(IconData icon) {
    return Container(
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        border: Border.all(color: Colors.grey[300]!),
      ),
      child: Icon(
        icon,
        size: 18,
        color: Colors.grey[600],
      ),
    );
  }
}
