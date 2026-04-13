import 'package:flutter/material.dart';
import 'package:mobile/features/dashboard/data/models/category_model.dart';
import 'package:mobile/features/products/presentation/product_list_page.dart';
import '../../data/datasources/category_local_data.dart';
// Gideceğin sayfanın importunu buraya ekle
// import 'package:mobile/features/products/presentation/pages/category_detail_page.dart';

class CategorySection extends StatelessWidget {
  const CategorySection({super.key});
  int _mapTitleToGender(String title) {
    switch (title.toLowerCase()) {
      case "erkek":
        return 1;
      case "kadın":
        return 2;
      case "çocuk":
        return 3;
      default:
        return 0;
    }
  }

  @override
  Widget build(BuildContext context) {
    final List<CategoryModel> categories = CategoryLocalData.getCategories();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 16),
          child: Text(
            "KATEGORİ",
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
        ),
        const SizedBox(height: 12),
        SizedBox(
          height: 290,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding:
                const EdgeInsets.only(right: 16), // Son kartın yapışmaması için
            itemCount: categories.length,
            itemBuilder: (context, i) {
              final item = categories[i];

              return Container(
                width: 180,
                margin: const EdgeInsets.only(left: 16),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(20),
                  child: Stack(
                    children: [
                      // 1. Arka Plan Resmi
                      Positioned.fill(
                        child: Image.network(
                          item.image,
                          fit: BoxFit.cover,
                        ),
                      ),

                      // 2. Metin Okunabilirliği için Hafif Karartma (Opsiyonel)
                      Positioned.fill(
                        child: Container(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.bottomCenter,
                              end: Alignment.topCenter,
                              colors: [
                                Colors.black.withOpacity(0.6),
                                Colors.transparent,
                              ],
                            ),
                          ),
                        ),
                      ),

                      Positioned(
                        bottom: 16,
                        left: 16,
                        child: Text(
                          item.title,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),

                      // 4. TIKLAMA EFEKTİ (En Üstte Olmalı)
                      Positioned.fill(
                        child: Material(
                          color: Colors
                              .transparent, // Resmin görünmesi için şeffaf
                          child: InkWell(
                            splashColor:
                                Colors.white.withOpacity(0.3), // Tıklama rengi
                            highlightColor: Colors.white.withOpacity(0.1),
                            onTap: () {
                              final genderId = _mapTitleToGender(item.title);

                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => ProductListPage(
                                    genderId: genderId, // ✅ BURASI
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
              );
            },
          ),
        )
      ],
    );
  }
}

// Örnek Hedef Sayfa (Hata almamak için geçici olarak buraya ekleyebilirsin)
class CategoryDetailPage extends StatelessWidget {
  final CategoryModel category;
  const CategoryDetailPage({super.key, required this.category});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(category.title)),
      body: Center(
          child: Text("${category.title} ürünleri burada listelenecek.")),
    );
  }
}
