import 'package:flutter/material.dart';
import 'package:mobile/features/dashboard/presentation/screens/cart_page.dart';
import 'package:mobile/features/dashboard/presentation/state/cart_service.dart';
import 'package:mobile/features/dashboard/presentation/state/favorite_service.dart';
import 'package:mobile/features/products/data/datasources/product_remote_data_source.dart';
import 'package:mobile/features/products/data/repositories/product_repository_impl.dart';
import 'package:mobile/features/products/presentation/product_list_page.dart';
import 'package:provider/provider.dart';
import '../../products/domain/entities/product.dart';

class ProductDetailPage extends StatefulWidget {
  final Product product;

  const ProductDetailPage({
    super.key,
    required this.product,
  });

  @override
  State<ProductDetailPage> createState() => _ProductDetailPageState();
}

class _ProductDetailPageState extends State<ProductDetailPage> {
  final PageController _pageController = PageController();
  int currentPage = 0;
  String selectedSize = ""; // Başlangıçta hiçbiri seçili değil
  late final List<String> productImages;
  List<Product> similarProducts = [];
  bool isLoadingSimilar = true;

  // Şimdilik mock. Sonra backend’den gelecek.
  final List<String> sizes = ["XS", "S", "M", "L"];

  @override
  void initState() {
    super.initState();

    productImages = widget.product.imageUrls.isNotEmpty
        ? widget.product.imageUrls
        : [
            if (widget.product.mainImageUrl != null)
              widget.product.mainImageUrl!,
          ];
    _loadSimilarProducts();
  }

  Future<void> _loadSimilarProducts() async {
    try {
      final repo = ProductRepositoryImpl(ProductRemoteDataSource());

      final response = await repo.getFilteredProducts(
        categoryId: widget.product.categoryId,
        brand: widget.product.brand,
        gender: widget.product.gender,
        page: 1,
      );

      final items = response.items;

      setState(() {
        similarProducts =
            items.where((p) => p.id != widget.product.id).take(10).toList();

        isLoadingSimilar = false;
      });
    } catch (e) {
      print("SIMILAR ERROR: $e");
      setState(() => isLoadingSimilar = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final favService = context.watch<FavoriteService>();
    final isFav = favService.isFavorite(widget.product.id);

    return Scaffold(
      backgroundColor: Colors.white,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            backgroundColor: Colors.white,
            pinned: true,
            expandedHeight: 520,
            leading: IconButton(
              icon: const Icon(Icons.arrow_back, color: Colors.black),
              onPressed: () => Navigator.pop(context),
            ),
            actions: const [
              Padding(
                padding: EdgeInsets.only(right: 12),
                child: Icon(Icons.ios_share_outlined, color: Colors.black),
              ),
            ],
            flexibleSpace: FlexibleSpaceBar(
              background: Padding(
                padding: const EdgeInsets.only(top: 40),
                child: Stack(
                  children: [
                    PageView.builder(
                      controller: _pageController,
                      itemCount: productImages.length,
                      onPageChanged: (index) {
                        setState(() {
                          currentPage = index;
                        });
                      },
                      itemBuilder: (context, index) {
                        return Image.network(
                          productImages[index],
                          width: double.infinity,
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) => Container(
                            color: Colors.grey.shade200,
                            child: const Center(
                              child: Icon(Icons.image_not_supported_outlined),
                            ),
                          ),
                        );
                      },
                    ),
                    Positioned(
                      bottom: 20,
                      left: 0,
                      right: 0,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: List.generate(
                          productImages.length,
                          (index) => Container(
                            margin: const EdgeInsets.symmetric(horizontal: 4),
                            width: currentPage == index ? 18 : 6,
                            height: 6,
                            decoration: BoxDecoration(
                              color: currentPage == index
                                  ? Colors.white
                                  : Colors.white70,
                              borderRadius: BorderRadius.circular(10),
                            ),
                          ),
                        ),
                      ),
                    ),
                    Positioned(
                      bottom: 20,
                      right: 16,
                      child: GestureDetector(
                        onTap: () async {
                          try {
                            await context
                                .read<FavoriteService>()
                                .toggleFavorite(widget.product.id);
                          } catch (e) {
                            print("FAVORITE ERROR: $e");
                          }
                        },
                        child: Container(
                          width: 42,
                          height: 42,
                          decoration: const BoxDecoration(
                            color: Colors.white,
                            shape: BoxShape.circle,
                          ),
                          child: Icon(
                            isFav ? Icons.favorite : Icons.favorite_border,
                            color: Colors.black,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 18, 16, 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    widget.product.name.toUpperCase(),
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    "${widget.product.price.toStringAsFixed(2)} TL",
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    widget.product.description,
                    style: const TextStyle(
                      fontSize: 15,
                      height: 1.5,
                      color: Colors.black87,
                    ),
                  ),
                  const SizedBox(height: 18),
                  Row(
                    children: [
                      const Text(
                        "Ürün Kodu: ",
                        style: TextStyle(fontWeight: FontWeight.w700),
                      ),
                      Text(widget.product.id.substring(0, 8)),
                    ],
                  ),
                  const SizedBox(height: 24),
                  if (sizes.isNotEmpty) ...[
                    const Text(
                      "Bedenler",
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Wrap(
                      spacing: 10,
                      runSpacing: 10,
                      children: sizes.map((size) {
                        final isSelected = selectedSize == size;

                        return GestureDetector(
                          onTap: () {
                            setState(() {
                              selectedSize = size;
                            });
                          },
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 18,
                              vertical: 12,
                            ),
                            decoration: BoxDecoration(
                              //seçili ise siyah değilse beyaz arkaplan
                              color: isSelected ? Colors.black : Colors.white,
                              border: Border.all(color: Colors.black),
                            ),
                            child: Text(
                              size,
                              style: TextStyle(
                                  color:
                                      isSelected ? Colors.white : Colors.black,
                                  fontWeight: isSelected
                                      ? FontWeight.bold
                                      : FontWeight.normal),
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 28),
                  ],
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () async {
                        try {
                          await context
                              .read<CartService>()
                              .addToCart(widget.product.id);

                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              behavior: SnackBarBehavior.floating,
                              backgroundColor: Colors.black,
                              elevation: 0,
                              margin: const EdgeInsets.symmetric(
                                  horizontal: 12, vertical: 12),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(
                                    4), // çok yuvarlak değil
                              ),
                              duration: const Duration(seconds: 2),
                              content: Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  /// SOL TEXT
                                  const Text(
                                    "SEPETE EKLENDİ",
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontWeight: FontWeight.w700,
                                      fontSize: 13,
                                      letterSpacing: 0.5,
                                    ),
                                  ),

                                  /// SAĞ CTA
                                  GestureDetector(
                                    onTap: () {
                                      Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                          builder: (_) => CartPage(),
                                        ),
                                      );
                                    },
                                    child: const Text(
                                      "SEPETE GİT →",
                                      style: TextStyle(
                                        color: Colors.white,
                                        fontWeight: FontWeight.bold,
                                        fontSize: 13,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          );
                        } catch (e) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              backgroundColor: Colors.black,
                              content: Text(
                                "HATA OLUŞTU",
                                style: TextStyle(color: Colors.white),
                              ),
                            ),
                          );
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.black,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 18),
                        shape: const RoundedRectangleBorder(),
                      ),
                      child: const Text(
                        "SEPETE EKLE",
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 10),
                  const Text(
                    "Benzer Ürünler",
                    style: TextStyle(
                      fontSize: 17,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  const SizedBox(height: 14),
                  SizedBox(
                    height: 260,
                    child: ListView.separated(
                      scrollDirection: Axis.horizontal,
                      itemCount: similarProducts.length,
                      separatorBuilder: (_, __) => const SizedBox(width: 12),
                      itemBuilder: (context, index) {
                        return SizedBox(
                          width: 160,
                          child: ProductCard(
                            product: similarProducts[index],
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
