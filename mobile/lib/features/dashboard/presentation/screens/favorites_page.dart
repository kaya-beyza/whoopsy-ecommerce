import 'package:flutter/material.dart';
import 'package:mobile/features/auth/data/datasources/auth_local_data_source.dart';
import 'package:mobile/features/dashboard/data/datasources/favorite_remote_data_source.dart';
import 'package:mobile/features/dashboard/data/repositories/favorite_repository_impl.dart';
import 'package:mobile/features/dashboard/presentation/screens/cart_page.dart';
import 'package:mobile/features/dashboard/presentation/state/cart_service.dart';
import 'package:mobile/features/dashboard/presentation/state/favorite_service.dart';
import 'package:mobile/features/products/domain/entities/product.dart';
import 'package:mobile/features/products/presentation/product_detail_page.dart';
import 'package:provider/provider.dart';

class FavoritesPage extends StatefulWidget {
  const FavoritesPage({super.key});

  @override
  State<FavoritesPage> createState() => _FavoritesPageState();
}

class _FavoritesPageState extends State<FavoritesPage> {
  bool _isLoading = true;
  String? _errorMessage;
  List<Product> _products = [];

  late final FavoriteRepositoryImpl _repo;

  @override
  void initState() {
    super.initState();
    _repo = FavoriteRepositoryImpl(FavoriteRemoteDataSource());
    _loadFavorites();
  }

  Future<void> _loadFavorites() async {
    try {
      final userId = await AuthLocalDataSource().getUserId();

      if (userId == null || userId.isEmpty) {
        setState(() {
          _isLoading = false;
          _errorMessage = "Kullanıcı bulunamadı";
        });
        return;
      }

      final data = await _repo.getUserFavorites(userId);
      context.read<FavoriteService>().setFavorites(
            data.map((e) => e.id).toList(),
          );
      setState(() {
        _products = data;
        _isLoading = false;
      });
    } catch (e) {
      print("FAVORITES ERROR: $e");

      setState(() {
        _errorMessage = "Favoriler yüklenemedi";
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Favorilerim"),
      ),
      body: _buildBody(),
    );
  }

  Widget _buildBody() {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_errorMessage != null) {
      return Center(child: Text(_errorMessage!));
    }

    if (_products.isEmpty) {
      return const Center(child: Text("Favori ürün yok"));
    }

    return GridView.builder(
      padding: const EdgeInsets.all(10),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        childAspectRatio: 0.7,
      ),
      itemCount: _products.length,
      itemBuilder: (_, i) => FavoriteCard(product: _products[i]),
    );
  }
}

class FavoriteCard extends StatelessWidget {
  final Product product;

  const FavoriteCard({super.key, required this.product});

  @override
  Widget build(BuildContext context) {
    final favService = context.watch<FavoriteService>();
    final isFav = favService.isFavorite(product.id);
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => ProductDetailPage(product: product),
          ),
        );
      },
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          /// IMAGE + ICONS
          Expanded(
            child: Stack(
              children: [
                /// IMAGE
                Positioned.fill(
                  child: Image.network(
                    product.mainImageUrl ?? "",
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => Container(
                      color: Colors.grey.shade200,
                      child: const Icon(Icons.image_not_supported),
                    ),
                  ),
                ),

                Positioned(
                  right: 4,
                  bottom: 4,
                  child: Column(
                    children: [
                      /// 🛒 SEPET
                      _iconButton(
                        icon: Icons.shopping_bag_outlined,
                        onTap: () async {
                          try {
                            await context
                                .read<CartService>()
                                .addToCart(product.id);

                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                behavior: SnackBarBehavior
                                    .floating, // 🔥 klasik bar değil
                                backgroundColor:
                                    Colors.black, // 🔥 siyah arka plan
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
                                        fontWeight: FontWeight.w700, // 🔥 kalın
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
                      ),

                      const SizedBox(height: 4),

                      /// ❤️ FAVORİ (DOLU)
                      _iconButton(
                        icon: isFav ? Icons.favorite : Icons.favorite_border,
                        onTap: () async {
                          try {
                            await context
                                .read<FavoriteService>()
                                .toggleFavorite(product.id);

                            if (context.mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                    content: Text("Favorilerden çıkarıldı")),
                              );
                            }
                          } catch (e) {
                            print("REMOVE ERROR: $e");
                          }
                        },
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 6),

          /// NAME
          Text(
            product.name,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(fontSize: 13),
          ),

          const SizedBox(height: 4),

          /// PRICE
          Text(
            "${product.price} ₺",
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 14,
            ),
          ),
        ],
      ),
    );
  }

  Widget _iconButton({
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 34,
        height: 34,
        decoration: BoxDecoration(
          color: Colors.black.withOpacity(0.3),
          shape: BoxShape.circle,
        ),
        child: Icon(
          icon,
          size: 18,
          color: Colors.white,
        ),
      ),
    );
  }
}
