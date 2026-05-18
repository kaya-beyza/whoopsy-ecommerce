import 'package:flutter/material.dart';
import 'package:mobile/features/auth/data/datasources/auth_local_data_source.dart';
import 'package:mobile/features/auth/presentation/pages/login_page.dart';
import 'package:mobile/features/dashboard/data/datasources/favorite_remote_data_source.dart';
import 'package:mobile/features/dashboard/data/repositories/favorite_repository_impl.dart';
import 'package:mobile/features/dashboard/presentation/screens/account_page.dart';
import 'package:mobile/features/dashboard/presentation/screens/cart_page.dart';
import 'package:mobile/features/dashboard/presentation/state/cart_service.dart';
import 'package:mobile/features/dashboard/presentation/state/favorite_service.dart';
import 'package:mobile/features/dashboard/presentation/widgets/auth_required_view.dart';
import 'package:mobile/features/products/domain/entities/product.dart';
import 'package:mobile/features/products/presentation/product_detail_page.dart';
import 'package:provider/provider.dart';
import 'package:mobile/features/auth/presentation/state/auth_provider.dart';

class FavoritesPage extends StatefulWidget {
  const FavoritesPage({super.key});

  @override
  State<FavoritesPage> createState() => _FavoritesPageState();
}

class _FavoritesPageState extends State<FavoritesPage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<FavoriteService>().loadFavorites();
    });
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
    final auth = context.watch<AuthProvider>();
    final favService = context.watch<FavoriteService>();
    if (!auth.isAuthenticated) {
      return AuthRequiredView(
        title: "Favorilerinizi görmek için giriş yapın",
        description:
            "Beğendiğiniz ürünleri kaydedebilmek ve tüm cihazlarınızda görüntüleyebilmek için hesabınıza giriş yapın.",
        onLogin: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => const LoginPage(),
            ),
          );
        },
      );
    }

    if (favService.loading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (favService.products.isEmpty) {
      return const Center(
        child: Text("Favori ürün yok"),
      );
    }

    return GridView.builder(
      padding: const EdgeInsets.all(10),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        childAspectRatio: 0.7,
      ),
      itemCount: favService.products.length,
      itemBuilder: (_, i) => FavoriteCard(product: favService.products[i]),
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
