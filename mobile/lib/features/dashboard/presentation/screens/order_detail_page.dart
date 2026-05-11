import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:mobile/features/products/data/datasources/product_remote_data_source.dart';
import 'package:mobile/features/products/data/repositories/product_repository_impl.dart';
import 'package:mobile/features/products/presentation/product_detail_page.dart';
import '../../data/datasources/order_remote_data_source.dart';
import '../../data/repositories/order_repository.dart';
import '../../data/models/order_model.dart';

class OrderDetailPage extends StatefulWidget {
  const OrderDetailPage({super.key});

  @override
  State<OrderDetailPage> createState() => _OrderDetailPageState();
}

class _OrderDetailPageState extends State<OrderDetailPage> {
  late final OrderRepository _repo;
  String? _returnCode;

  OrderModel? _order;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _repo = OrderRepository(OrderRemoteDataSource());
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();

    final args = ModalRoute.of(context)?.settings.arguments;

    if (args is String) {
      _loadDetail(args);
    }
  }

  Future<void> _loadDetail(String orderId) async {
    try {
      final data = await _repo.getOrderDetail(orderId);

      if (!mounted) return;

      setState(() {
        _order = data;
      });

      if (!mounted) return;

      setState(() {
        _isLoading = false;
      });
    } catch (e) {
      print("DETAIL ERROR: $e");
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text("SİPARİŞ DETAYI"),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _order == null
              ? const Center(child: Text("Sipariş bulunamadı"))
              : _buildContent(),
    );
  }

  Widget _buildContent() {
    final date = DateFormat("dd/MM/yyyy").format(_order!.createdDate);

    return ListView(
      padding: const EdgeInsets.all(12),
      children: [
        /// STATUS
        Text(
          _mapStatus(_order!.status ?? ""),
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 16,
          ),
        ),

        const SizedBox(height: 6),

        /// DATE
        Text(
          "$date tarihinde oluşturuldu",
          style: const TextStyle(
            color: Colors.black54,
            fontSize: 13,
          ),
        ),

        const SizedBox(height: 14),

        /// ADDRESS
        Text(
          _order!.shippingAddress ?? "",
          style: const TextStyle(color: Colors.black87),
        ),

        const SizedBox(height: 20),

        /// PRODUCTS
        ..._order!.items.map((item) {
          return GestureDetector(
            onTap: () async {
              final productRepo =
                  ProductRepositoryImpl(ProductRemoteDataSource());

              final product = await productRepo.getProductById(item.productId);

              if (!context.mounted) return;

              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => ProductDetailPage(product: product),
                ),
              );
            },
            child: Container(
              margin: const EdgeInsets.only(bottom: 12),
              child: Row(
                children: [
                  Container(
                    width: 80,
                    height: 100,
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
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(item.productName ?? ""),
                        const SizedBox(height: 6),
                        Text("Adet: ${item.quantity ?? 0}"),
                        const SizedBox(height: 6),
                        Text(
                          "${(item.totalPrice ?? 0).toStringAsFixed(2)} TL",
                        ),
                      ],
                    ),
                  )
                ],
              ),
            ),
          );
        }),

        const SizedBox(height: 20),

        /// TOTAL
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              "TOPLAM",
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            Text(
              "${(_order!.totalAmount ?? 0).toStringAsFixed(2)} TL",
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
          ],
        ),
        const SizedBox(height: 30),

        /// ACTION BUTTONS
        if (_order != null &&
            (_order!.status.toLowerCase() == "pending" ||
                _order!.status.toLowerCase() == "confirmed"))
          SizedBox(
            width: double.infinity,
            height: 48,
            child: OutlinedButton(
              onPressed: () async {
                try {
                  await _repo.updateOrderStatus(
                    orderId: _order!.id,
                    status: "Cancelled",
                  );

                  final updated = await _repo.getOrderDetail(_order!.id);

                  setState(() {
                    _order = updated;
                  });
                } catch (e) {
                  print(e);
                }
              },
              style: OutlinedButton.styleFrom(
                elevation: 0,
                backgroundColor: Colors.black,
                foregroundColor: Colors.white,
                side: BorderSide(
                  color: Colors.grey.shade300,
                  width: 1,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              child: const Text(
                "SİPARİŞİ İPTAL ET",
                style: TextStyle(
                  fontSize: 12,
                  letterSpacing: 1.2,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ),

        if (_order != null &&
            (_order!.status.toLowerCase() == "shipped" ||
                _order!.status.toLowerCase() == "delivered"))
          SizedBox(
            width: double.infinity,
            height: 48,
            child: OutlinedButton(
              onPressed: () async {
                final code =
                    "RT${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}";

                await _repo.updateOrderStatus(
                  orderId: _order!.id,
                  status: "Returned",
                );

                final updated = await _repo.getOrderDetail(_order!.id);

                setState(() {
                  _returnCode = code;

                  _order = OrderModel(
                    id: updated.id,
                    totalAmount: updated.totalAmount,
                    status: updated.status,
                    shippingAddress: updated.shippingAddress,
                    createdDate: updated.createdDate,
                    items: updated.items,
                    mainImageUrl: updated.mainImageUrl,
                  );
                });
              },
              style: OutlinedButton.styleFrom(
                elevation: 0,
                backgroundColor: Colors.black,
                foregroundColor: Colors.white,
                side: BorderSide.none,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              child: const Text(
                "İADE ET",
                style: TextStyle(
                  fontSize: 12,
                  letterSpacing: 1.2,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ),
        if (_returnCode != null) ...[
          const SizedBox(height: 16),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: Colors.grey.shade100,
              border: Border.all(
                color: Colors.grey.shade300,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  "İADE KODU",
                  style: TextStyle(
                    fontSize: 11,
                    letterSpacing: 1.2,
                    fontWeight: FontWeight.w600,
                    color: Colors.black54,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  _returnCode!,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 2,
                  ),
                ),
              ],
            ),
          ),
        ],
      ],
    );
  }

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
        return "İPTAL EDİLDİ";
      case "returned":
        return "İADE TALEBİ OLUŞTURULDU";
      default:
        return status.toUpperCase();
    }
  }
}
