import 'package:flutter/material.dart';
import 'package:mobile/features/auth/data/datasources/auth_local_data_source.dart';
import 'package:mobile/features/dashboard/data/datasources/cart_remote_data_source.dart';
import 'package:mobile/features/dashboard/presentation/screens/favorites_page.dart';
import 'package:mobile/features/products/data/models/product_model.dart';
import 'package:mobile/features/products/presentation/product_detail_page.dart';

class CartPage extends StatefulWidget {
  const CartPage({super.key});

  @override
  State<CartPage> createState() => _CartPageState();
}

class _CartPageState extends State<CartPage> {
  final _remote = CartRemoteDataSource();
  final _local = AuthLocalDataSource();

  List<dynamic> _items = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadCart();
  }

  Future<void> _loadCart() async {
    final userId = await _local.getUserId();

    if (userId == null) return;

    final data = await _remote.getUserCart(userId);

    setState(() {
      _items = data;
      _loading = false;
    });
  }

  Future<void> _update(dynamic item, int newQty) async {
    if (newQty <= 0) return _remove(item);

    final userId = await _local.getUserId();
    if (userId == null) return;

    try {
      await _remote.updateQuantity(
        userId,
        item["productId"],
        newQty,
      );

      _loadCart();
    } catch (e) {
      print("UPDATE ERROR: $e");
    }
  }

  Future<void> _remove(dynamic item) async {
    final userId = await _local.getUserId();
    if (userId == null) return;

    try {
      await _remote.removeItem(
        userId,
        item["productId"],
      );

      _loadCart();

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          behavior: SnackBarBehavior.floating,
          backgroundColor: Colors.black,
          elevation: 0,
          margin: const EdgeInsets.fromLTRB(12, 0, 12, 90),
          content: const Text(
            "Ürün sepetten çıkarıldı",
            style: TextStyle(color: Colors.white, fontSize: 12),
          ),
          duration: const Duration(milliseconds: 1200),
        ),
      );
    } catch (e) {
      print("REMOVE ERROR: $e");
    }
  }

  int get totalPrice {
    return _items.fold(
        0, (sum, item) => sum + (item["totalPrice"] as num).toInt());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text("Sepetim"),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
      ),
      body: SafeArea(
        child: _loading
            ? const Center(child: CircularProgressIndicator())

            ///  EMPTY
            : _items.isEmpty
                ? _emptyCart()

                ///  FILLED
                : Column(
                    children: [
                      Expanded(
                        child: ListView.builder(
                          itemCount: _items.length,
                          itemBuilder: (_, i) {
                            return _cartItem(_items[i]);
                          },
                        ),
                      ),
                      _bottomSection(),
                    ],
                  ),
      ),
    );
  }

  /// ================= EMPTY =================
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

  /// ================= CART ITEM =================
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
              /// IMAGE
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

              /// INFO
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
                          onTap: () =>
                              _update(item, (item["quantity"] as int) - 1),
                        ),
                        Container(
                          width: 40,
                          alignment: Alignment.center,
                          child: Text("${item["quantity"]}"),
                        ),
                        _qtyButton(
                          icon: Icons.add,
                          onTap: () =>
                              _update(item, (item["quantity"] as int) + 1),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    GestureDetector(
                      onTap: () => _remove(item),
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

  /// ================= QTY BUTTON =================
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

  /// ================= BOTTOM =================
  Widget _bottomSection() {
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
                "$totalPrice ₺",
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
            ],
          ),
          const SizedBox(height: 10),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () {},
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
