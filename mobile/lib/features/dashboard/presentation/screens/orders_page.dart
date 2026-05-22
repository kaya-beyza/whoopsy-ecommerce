import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:mobile/features/dashboard/presentation/screens/order_detail_page.dart';
import 'package:mobile/features/products/presentation/product_list_page.dart';
import '../../data/datasources/order_remote_data_source.dart';
import '../../data/repositories/order_repository.dart';
import '../../data/models/order_model.dart';

class OrdersPage extends StatefulWidget {
  const OrdersPage({super.key});

  @override
  State<OrdersPage> createState() => _OrdersPageState();
}

class _OrdersPageState extends State<OrdersPage> {
  late final OrderRepository _repo;

  List<OrderModel> _orders = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _repo = OrderRepository(OrderRemoteDataSource());
    _loadOrders();
  }

  Future<void> _loadOrders() async {
    try {
      final data = await _repo.getOrders();

      setState(() {
        _orders = data;
        _isLoading = false;
      });
    } catch (e) {
      print("ORDER ERROR: $e");
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text("SİPARİŞLERİM"),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _orders.isEmpty
              ? _emptyState()
              : ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  itemCount: _orders.length,
                  itemBuilder: (_, i) {
                    return _orderCard(context, _orders[i]);
                  },
                ),
    );
  }

  ///  EMPTY STATE (çok önemli UX)
  Widget _emptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Text(
            "Henüz siparişin yok",
            style: TextStyle(fontSize: 16),
          ),
          const SizedBox(height: 10),
          GestureDetector(
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => const ProductListPage(),
                ),
              );
            },
            child: const Text(
              "Alışverişe başla →",
              style: TextStyle(
                fontWeight: FontWeight.bold,
              ),
            ),
          )
        ],
      ),
    );
  }

  Widget _orderCard(BuildContext context, OrderModel order) {
    final date = DateFormat("dd/MM/yyyy").format(order.createdDate);

    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => const OrderDetailPage(),
            settings: RouteSettings(arguments: order.id),
          ),
        );
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 14),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          border: Border.all(color: Colors.black12),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            /// STATUS
            Text(
              _mapStatus(order.status),
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 16,
                letterSpacing: 0.5,
              ),
            ),

            const SizedBox(height: 4),

            /// DATE
            Text(
              "$date tarihinde oluşturuldu",
              style: const TextStyle(
                color: Colors.black54,
                fontSize: 13,
              ),
            ),

            const SizedBox(height: 8),

            /// PRICE
            Text(
              "${order.totalAmount.toStringAsFixed(2)} TL",
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 14,
              ),
            ),

            const SizedBox(height: 12),

            /// PRODUCTS PREVIEW
            Row(
              children: [
                ...order.items.take(2).map(
                      (item) => Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: Container(
                          width: 100,
                          height: 90,
                          color: Colors.grey.shade100,
                          child: (item.mainImageUrl != null &&
                                  item.mainImageUrl!.isNotEmpty)
                              ? Image.network(
                                  item.mainImageUrl!,
                                  fit: BoxFit.cover,
                                  errorBuilder: (_, __, ___) =>
                                      const Icon(Icons.image),
                                )
                              : const Icon(Icons.image),
                        ),
                      ),
                    ),
                const Spacer(),
                const Icon(Icons.arrow_forward),
              ],
            )
          ],
        ),
      ),
    );
  }

  ///  STATUS MAP (backend enum → UI)
  String _mapStatus(String status) {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "ONAYLANDI";

      case "pending":
        return "HAZIRLANIYOR";

      case "shipped":
        return "GÖNDERİLDİ";

      case "delivered":
        return "TESLİM EDİLDİ";

      case "cancelled":
        return "X İPTAL EDİLDİ";

      case "returnrequested":
        return "İADE TALEBİ OLUŞTURULDU";

      case "returnapproved":
        return "İADE ONAYLANDI";

      case "returnrejected":
        return "İADE REDDEDİLDİ";

      case "returned":
        return "İADE TAMAMLANDI";

      default:
        return status.toUpperCase();
    }
  }
}
