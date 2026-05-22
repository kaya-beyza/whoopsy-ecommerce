import 'package:flutter/material.dart';
import 'package:mobile/features/auth/presentation/pages/login_page.dart';
import 'package:mobile/features/dashboard/data/datasources/cart_remote_data_source.dart';
import 'package:mobile/features/dashboard/presentation/checkout_page.dart';
import 'package:mobile/features/dashboard/presentation/screens/favorites_page.dart';
import 'package:mobile/features/dashboard/presentation/state/cart_service.dart';
import 'package:mobile/features/dashboard/presentation/widgets/auth_required_view.dart';
import 'package:mobile/features/products/data/models/product_model.dart';
import 'package:mobile/features/products/presentation/product_detail_page.dart';
import 'package:mobile/features/auth/presentation/state/auth_provider.dart';
import 'package:provider/provider.dart';

class CartPage extends StatefulWidget {
  const CartPage({super.key});

  @override
  State<CartPage> createState() => _CartPageState();
}

class _CartPageState extends State<CartPage> {
  final _remote = CartRemoteDataSource();

  @override
  void initState() {
    super.initState();

    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<CartService>().loadCart();
    });
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final cartService = context.watch<CartService>();

    if (!auth.isAuthenticated) {
      return Scaffold(
        backgroundColor: Colors.white,
        appBar: AppBar(
          title: const Text("Sepetim"),
          backgroundColor: Colors.white,
          foregroundColor: Colors.black,
          elevation: 0,
        ),
        body: AuthRequiredView(
          title: "Sepetinizi görüntülemek için giriş yapın",
          description:
              "Sepetinizdeki ürünleri kaybetmemek ve sipariş oluşturabilmek için giriş yapın.",
          onLogin: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => const LoginPage(),
              ),
            );
          },
        ),
      );
    }

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text("Sepetim"),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
      ),
      body: SafeArea(
        child: cartService.loading
            ? const Center(child: CircularProgressIndicator())
            : cartService.items.isEmpty
                ? _emptyCart()
                : Column(
                    children: [
                      Expanded(
                        child: ListView.builder(
                          itemCount: cartService.items.length,
                          itemBuilder: (_, i) {
                            return _cartItem(cartService.items[i]);
                          },
                        ),
                      ),
                      _bottomSection(cartService),
                    ],
                  ),
      ),
    );
  }

  Widget _emptyCart() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.shopping_bag_outlined, size: 60, color: Colors.black26),
          const SizedBox(height: 12),
          const Text(
            "SEPETİNİZ BOŞ",
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 16,
              letterSpacing: 1,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            "Beğendiğiniz ürünleri ekleyin",
            style: TextStyle(color: Colors.black45),
          ),
          const SizedBox(height: 20),
          SizedBox(
            width: 220,
            child: ElevatedButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => const FavoritesPage(),
                  ),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.black,
                elevation: 0,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: const RoundedRectangleBorder(
                  borderRadius: BorderRadius.zero,
                ),
              ),
              child: const Text(
                "İSTEK LİSTEME GİT",
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1,
                ),
              ),
            ),
          )
        ],
      ),
    );
  }

  Widget _cartItem(dynamic item) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => ProductDetailPage(
              product: ProductModel.fromJson(item),
            ),
          ),
        );
      },
      child: Card(
        elevation: 0,
        margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(4),
          side: const BorderSide(color: Colors.black12),
        ),
        child: Padding(
          padding: const EdgeInsets.all(10),
          child: Row(
            children: [
              Container(
                width: 90,
                height: 110,
                decoration: BoxDecoration(
                  color: Colors.grey.shade100,
                ),
                child: Image.network(
                  item["mainImageUrl"] ?? "",
                  fit: BoxFit.cover,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      item["productName"] ?? "",
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      "${item["price"]} TL",
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 10),
                    Row(
                      children: [
                        _qtyButton(
                          icon: Icons.remove,
                          onTap: () async {
                            final qty = (item["quantity"] as int) - 1;

                            if (qty <= 0) {
                              await context
                                  .read<CartService>()
                                  .removeItem(item["productId"]);
                            } else {
                              await context.read<CartService>().updateQuantity(
                                    item["productId"],
                                    qty,
                                  );
                            }
                          },
                        ),
                        Container(
                          width: 40,
                          alignment: Alignment.center,
                          child: Text("${item["quantity"]}"),
                        ),
                        _qtyButton(
                          icon: Icons.add,
                          onTap: () async {
                            await context.read<CartService>().updateQuantity(
                                  item["productId"],
                                  (item["quantity"] as int) + 1,
                                );
                          },
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    GestureDetector(
                      onTap: () async {
                        await context
                            .read<CartService>()
                            .removeItem(item["productId"]);

                        if (!context.mounted) return;

                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            behavior: SnackBarBehavior.floating,
                            backgroundColor: Colors.black,
                            elevation: 0,
                            margin: const EdgeInsets.fromLTRB(12, 0, 12, 90),
                            content: const Text(
                              "Ürün sepetten çıkarıldı",
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 12,
                              ),
                            ),
                            duration: const Duration(milliseconds: 1200),
                          ),
                        );
                      },
                      child: const Text(
                        "Sepetten çıkar",
                        style: TextStyle(
                          fontSize: 12,
                          decoration: TextDecoration.underline,
                          color: Colors.black54,
                        ),
                      ),
                    )
                  ],
                ),
              )
            ],
          ),
        ),
      ),
    );
  }

  Widget _qtyButton({
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 32,
        height: 32,
        decoration: BoxDecoration(
          border: Border.all(color: Colors.black26),
        ),
        child: Icon(icon, size: 18),
      ),
    );
  }

  Widget _bottomSection(CartService cartService) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: const BoxDecoration(
        border: Border(top: BorderSide(color: Colors.black12)),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                "TOPLAM",
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              Text(
                "${cartService.totalPrice} ₺",
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () async {
                try {
                  final userId = await _remote.local.getUserId();

                  if (userId == null) return;

                  final createdOrder = await _remote.createOrder(
                    userId: userId,
                    items: cartService.items,
                  );

                  if (!context.mounted) return;

                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => CheckoutPage(
                        orderId: createdOrder,
                        totalPrice: cartService.totalPrice.toDouble(),
                      ),
                    ),
                  );
                } catch (e) {
                  print(e);

                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text("Sipariş oluşturulamadı"),
                    ),
                  );
                }
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF0E7A5F),
                elevation: 0,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: const RoundedRectangleBorder(
                  borderRadius: BorderRadius.zero,
                ),
              ),
              child: const Text(
                "SİPARİŞİ İŞLEME AL",
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1,
                ),
              ),
            ),
          )
        ],
      ),
    );
  }
}
