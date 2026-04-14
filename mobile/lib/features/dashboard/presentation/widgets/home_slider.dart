import 'dart:async';
import 'package:flutter/material.dart';
import 'package:mobile/features/categories/data/datasources/category_remote_data_source.dart';
import 'package:mobile/features/categories/data/repositories/category_repository_impl.dart';
import 'package:mobile/features/categories/domain/entities/category.dart';
import 'package:mobile/features/products/presentation/product_list_page.dart';

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
  Timer? _timer;
  List<Category> categories = [];
  bool isLoading = true;

  final repository = CategoryRepositoryImpl(CategoryRemoteDataSource());

  // Sadece senin göstermek istediğin slider kartları
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
    _timer?.cancel();
    _controller.dispose();
    super.dispose();
  }

  void _startAutoSlide() {
    _timer = Timer.periodic(const Duration(seconds: 5), (timer) {
      if (_controller.hasClients && sliderItems.isNotEmpty) {
        int currentPage = _controller.page?.round() ?? 0;
        index = (currentPage + 1) % sliderItems.length;

        _controller.animateToPage(
          index,
          duration: const Duration(milliseconds: 500),
          curve: Curves.easeInOut,
        );
      }
    });
  }

  // Sadece ana kategoriler içinde arar
  String? _findMainCategoryId(String title) {
    try {
      return categories
          .where((c) => c.parentId == null)
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
  Widget build(BuildContext context) {
    if (isLoading) {
      return const SizedBox(
        height: 500,
        child: Center(child: CircularProgressIndicator()),
      );
    }

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
                children: [
                  Image.network(
                    item.imageUrl,
                    fit: BoxFit.cover,
                    width: double.infinity,
                    height: double.infinity,
                    errorBuilder: (_, __, ___) =>
                        const Icon(Icons.image_not_supported),
                  ),
                  Positioned.fill(
                    child: Material(
                      color: Colors.transparent,
                      child: InkWell(
                        splashColor: Colors.white.withOpacity(0.3),
                        highlightColor: Colors.white.withOpacity(0.1),
                        onTap: () {
                          final mainCategoryId =
                              _findMainCategoryId(item.title);

                          print("SLIDER TITLE: ${item.title}");
                          print("MAIN CATEGORY ID: $mainCategoryId");

                          if (mainCategoryId == null) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                  content: Text(
                                      "Kategori bulunamadı: ${item.title}")),
                            );
                            return;
                          }

                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => ProductListPage(
                                categoryId: mainCategoryId,
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                  ),
                  Positioned(
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 100,
                    child: DecoratedBox(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.bottomCenter,
                          end: Alignment.topCenter,
                          colors: [
                            Colors.black.withOpacity(0.7),
                            Colors.transparent,
                          ],
                        ),
                      ),
                    ),
                  ),
                  Positioned(
                    bottom: 20,
                    left: 20,
                    right: 20,
                    child: Text(
                      item.title,
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
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
