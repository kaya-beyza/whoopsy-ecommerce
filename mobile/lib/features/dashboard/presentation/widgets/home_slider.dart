import 'dart:async';
import 'package:flutter/material.dart';
import 'package:mobile/features/categories/data/datasources/category_remote_data_source.dart';
import 'package:mobile/features/categories/data/repositories/category_repository_impl.dart';
import 'package:mobile/features/categories/domain/entities/category.dart';
import 'package:mobile/features/categories/presentation/category_products_page.dart';
import 'package:mobile/features/products/presentation/product_list_page.dart';
import 'package:provider/provider.dart';

// Resim ve başlığı bir arada tutmak için basit bir model
class SliderItem {
  final String imageUrl;
  final String title;

  SliderItem({required this.imageUrl, required this.title});
}

class HomeSlider extends StatefulWidget {
  const HomeSlider({super.key});

  @override
  State<HomeSlider> createState() => _HomeSliderState();
}

class _HomeSliderState extends State<HomeSlider> {
  final PageController _controller = PageController();
  int index = 0;
  Timer? _timer; // Timer'ı iptal edebilmek için referansını tutuyoruz
  List<Category> categories = []; // 🔥 backend data
  bool isLoading = true;
  final repository = CategoryRepositoryImpl(CategoryRemoteDataSource());
  // Veri yapısını model kullanacak şekilde güncelledik
  final List<SliderItem> sliderItems = [
    SliderItem(
      imageUrl:
          "https://res.cloudinary.com/dvesxxy8u/image/upload/q_auto/f_auto/v1776060874/ogciunxjhgvp36dhe1mj.jpg",
      title: "Giyim",
    ),
    SliderItem(
      imageUrl:
          "https://res.cloudinary.com/dvesxxy8u/image/upload/q_auto/f_auto/v1776062764/zcffrjllrfohz6lnausc.jpg",
      title: "Aksesuar",
    ),
    SliderItem(
      imageUrl:
          "https://res.cloudinary.com/dvesxxy8u/image/upload/v1776061051/nhw587cydc7x0kcaq5le.jpg",
      title: "Ayakkabi",
    ),
  ];

  @override
  void initState() {
    super.initState();
    _fetchCategories();
    _startAutoSlide();
  }

  @override
  void dispose() {
    // State yok edilirken Timer'ı mutlaka iptal etmeliyiz (hafıza sızıntısını önlemek için)
    _timer?.cancel();
    _controller.dispose();
    super.dispose();
  }

  void _startAutoSlide() {
    _timer = Timer.periodic(const Duration(seconds: 5), (timer) {
      if (_controller.hasClients && categories.isNotEmpty) {
        int currentPage = _controller.page?.round() ?? 0;
        index = (currentPage + 1) % categories.length;

        _controller.animateToPage(
          index,
          duration: const Duration(milliseconds: 500),
          curve: Curves.easeInOut,
        );
      }
    });
  }

  String? _findCategoryIdByTitle(String title) {
    try {
      return categories
          .firstWhere(
            (c) => c.name.toLowerCase().trim() == title.toLowerCase().trim(),
          )
          .id;
    } catch (e) {
      return null;
    }
  }

  Future<void> _fetchCategories() async {
    try {
      final result = await repository.getAllCategories();

      setState(() {
        categories = result;
        isLoading = false;
      });
    } catch (e) {
      print("CATEGORY ERROR: $e");
      setState(() {
        isLoading = false;
      });
    }
  }

  @override
  void Dispose() {
    _timer?.cancel();
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 500,
      child: PageView.builder(
        controller: _controller,
        itemCount: sliderItems.length,
        itemBuilder: (context, i) {
          final item = sliderItems[i];
          return Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(16),
              child: Stack(
                // Resim ve metni üst üste koymak için Stack
                children: [
                  // 1. Arka plandaki Resim
                  Image.network(
                    item.imageUrl,
                    fit: BoxFit.cover,
                    width: double.infinity, // Genişliği tam kapla
                    height: double.infinity, // Yüksekliği tam kapla
                    errorBuilder: (_, __, ___) =>
                        const Icon(Icons.image_not_supported),
                  ),
                  Positioned.fill(
                    child: Material(
                      color: Colors.transparent, // Resmin görünmesi için şeffaf
                      child: InkWell(
                        splashColor:
                            Colors.white.withOpacity(0.3), // Tıklama rengi
                        highlightColor: Colors.white.withOpacity(0.1),
                        onTap: () {
                          final categoryId = _findCategoryIdByTitle(item.title);

                          if (categoryId == null) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                  content: Text(
                                      "Kategori bulunamadı: ${item.title}")),
                            );
                            return; // 🚨 API çağrısı yapma
                          }

                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => ProductListPage(
                                categoryId: categoryId,
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                  ),
                  // 2. Metnin okunabilirliği için alt kısma hafif karartma (Gradyan)
                  Positioned(
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 100, // Sadece alt kısmı kapla
                    child: DecoratedBox(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.bottomCenter,
                          end: Alignment.topCenter,
                          colors: [
                            Colors.black.withOpacity(0.7), // Altta koyu
                            Colors.transparent, // Üste doğru şeffaf
                          ],
                        ),
                      ),
                    ),
                  ),

                  // 3. Sol Alt Köşedeki Metin
                  Positioned(
                    bottom: 20, // Alttan boşluk
                    left: 20, // Soldan boşluk
                    right: 20, // Sağdan boşluk (metin çok uzunsa taşmasın diye)
                    child: Text(
                      item.title,
                      style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Colors.white),
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
