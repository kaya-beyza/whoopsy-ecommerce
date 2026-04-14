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
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
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
              TextButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => const ProductListPage(),
                    ),
                  );
                },
                style: TextButton.styleFrom(
                  padding: EdgeInsets.zero,
                  minimumSize: const Size(50, 30),
                  tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                ),
                child: const Text(
                  "Ürünleri Gör →",
                  style: TextStyle(
                    fontSize: 12,
                    color: Color.fromARGB(255, 82, 83, 84),
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
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
                        child: Material(
                          color: Colors.transparent,
                          child: InkWell(
                            borderRadius: BorderRadius.circular(16),
                            splashColor: Colors.black.withOpacity(0.05),
                            onTap: () {
                              print("CLICKED BRAND ID: ${item.id}");
                              print("CLICKED BRAND NAME: ${item.name}");

                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => ProductListPage(
                                    brandId: item.id,
                                  ),
                                ),
                              );
                            },
                            child: Image.network(
                              item.image,
                              height: 90,
                              width: 100,
                              fit: BoxFit.cover,
                              errorBuilder: (_, __, ___) => Container(
                                color: Colors.grey.shade200,
                                child: const Icon(Icons.image_not_supported),
                              ),
                            ),
                          ),
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
        ),
      ],
    );
  }
}
