import 'package:flutter/material.dart';
import 'package:mobile/features/dashboard/data/models/brand.dart';
import '../../data/datasources/brand_local_data.dart';
import 'package:mobile/features/products/presentation/product_list_page.dart';

class BrandSection extends StatelessWidget {
  const BrandSection({super.key});

  @override
  Widget build(BuildContext context) {
    final List<Brand> brands = BrandLocalData.getBrands();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // BAŞLIK VE BUTON SATIRI
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            mainAxisAlignment:
                MainAxisAlignment.spaceBetween, // Biri en sola, diğeri en sağa
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const Text(
                "MARKALAR",
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 0.5,
                ),
              ),
              // Sadece yazı şeklinde buton
              TextButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => const ProductListPage(), // 🔥 TÜM ÜRÜNLER
                    ),
                  );
                },
                style: TextButton.styleFrom(
                  padding: EdgeInsets.zero,
                  minimumSize: const Size(50, 30),
                  tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                ),
                child: Text(
                  "Ürünleri Gör →",
                  style: TextStyle(
                    fontSize: 12,
                    color: const Color.fromARGB(255, 82, 83, 84),
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
        ),

        const SizedBox(height: 12),

        // MARKALAR LİSTESİ
        SizedBox(
          height: 145,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.only(right: 16),
            itemCount: brands.length,
            itemBuilder: (context, i) {
              final item = brands[i];

              return Container(
                width: 100,
                margin: const EdgeInsets.only(left: 16),
                child: Column(
                  children: [
                    SizedBox(
                      height: 90,
                      width: 100,
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(16),
                        child: Stack(
                          children: [
                            Image.network(
                              item.image,
                              height: 90,
                              width: 100,
                              fit: BoxFit.cover,
                            ),
                            Positioned.fill(
                              child: Material(
                                color: Colors.transparent,
                                child: InkWell(
                                  splashColor: Colors.black.withOpacity(0.05),
                                  onTap: () {
                                    Navigator.push(
                                      context,
                                      MaterialPageRoute(
                                        builder: (_) => ProductListPage(
                                          brandId: item.id, // 🔥 BURASI
                                        ),
                                      ),
                                    );
                                  },
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      item.name,
                      maxLines: 1,
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                        color: Colors.black87,
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        )
      ],
    );
  }
}
