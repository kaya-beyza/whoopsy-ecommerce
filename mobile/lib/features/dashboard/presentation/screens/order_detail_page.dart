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

  Map<String, String> _images = {};
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

      await _loadProductImages();

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

  Future<void> _loadProductImages() async {
    final productRepo = ProductRepositoryImpl(ProductRemoteDataSource());

    if (_order == null) return;

    final uniqueIds = _order!.items.map((e) => e.productId).toSet().toList();

    try {
      final products = await Future.wait(
        uniqueIds.map((id) => productRepo.getProductById(id)).toList(),
      );

      final tempImages = <String, String>{};

      for (var p in products) {
        tempImages[p.id] = p.mainImageUrl ?? "";
      }

      if (!mounted) return;

      setState(() {
        _images = tempImages;
      });
    } catch (e) {
      print("IMAGE LOAD ERROR: $e");
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
                    child: (_images[item.productId] ?? "").isNotEmpty
                        ? Image.network(
                            _images[item.productId]!,
                            fit: BoxFit.cover,
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
      ],
    );
  }

  String _mapStatus(String status) {
    switch (status.toLowerCase()) {
      case "pending":
        return "HAZIRLANIYOR";
      case "completed":
        return "TESLİM EDİLDİ";
      case "cancelled":
        return "İPTAL EDİLDİ";
      default:
        return status.toUpperCase();
    }
  }
}
