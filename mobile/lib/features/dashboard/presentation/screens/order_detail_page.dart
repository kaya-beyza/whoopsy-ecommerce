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
        _isLoading = false;
      });
    } catch (e) {
      print("DETAIL ERROR: $e");

      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _updateStatus(String status) async {
    try {
      await _repo.updateOrderStatus(
        orderId: _order!.id,
        status: status,
      );

      final updated = await _repo.getOrderDetail(_order!.id);

      if (!mounted) return;

      setState(() {
        _order = updated;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            status == "Cancelled"
                ? "Sipariş iptal edildi"
                : "İade talebi oluşturuldu",
          ),
        ),
      );
    } catch (e) {
      print(e);

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("İşlem başarısız"),
        ),
      );
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

    final status = _order!.status.toLowerCase();

    final canCancel = status == "pending" || status == "confirmed";

    final canReturn = status == "shipped" || status == "delivered";

    return ListView(
      padding: const EdgeInsets.all(12),
      children: [
        /// STATUS
        Text(
          _mapStatus(_order!.status),
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
          _order!.shippingAddress,
          style: const TextStyle(
            color: Colors.black87,
          ),
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
                crossAxisAlignment: CrossAxisAlignment.start,
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
                        Text(
                          item.productName,
                          style: const TextStyle(
                            fontSize: 14,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          "Adet: ${item.quantity}",
                          style: const TextStyle(
                            color: Colors.black54,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          "${item.totalPrice.toStringAsFixed(2)} TL",
                          style: const TextStyle(
                            fontWeight: FontWeight.w600,
                          ),
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
              style: TextStyle(
                fontWeight: FontWeight.bold,
              ),
            ),
            Text(
              "${_order!.totalAmount.toStringAsFixed(2)} TL",
              style: const TextStyle(
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),

        const SizedBox(height: 30),

        /// CANCEL BUTTON
        if (canCancel)
          SizedBox(
            width: double.infinity,
            height: 48,
            child: OutlinedButton(
              onPressed: () async {
                await _updateStatus("Cancelled");
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

        /// RETURN BUTTON
        if (canReturn)
          SizedBox(
            width: double.infinity,
            height: 48,
            child: OutlinedButton(
              onPressed: () async {
                await _updateStatus("ReturnRequested");
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
                "İADE TALEBİ OLUŞTUR",
                style: TextStyle(
                  fontSize: 12,
                  letterSpacing: 1.2,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ),
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
