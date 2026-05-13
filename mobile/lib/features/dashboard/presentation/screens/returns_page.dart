import 'package:flutter/material.dart';
import 'package:mobile/features/dashboard/data/datasources/order_remote_data_source.dart';
import 'package:mobile/features/dashboard/data/models/order_model.dart';
import 'package:mobile/features/dashboard/data/repositories/order_repository.dart';
import 'package:mobile/features/dashboard/presentation/screens/order_detail_page.dart';

class ReturnsPage extends StatefulWidget {
  const ReturnsPage({super.key});

  @override
  State<ReturnsPage> createState() => _ReturnsPageState();
}

class _ReturnsPageState extends State<ReturnsPage> {
  late final OrderRepository _repo;

  bool _isLoading = true;

  List<OrderModel> _returns = [];

  @override
  void initState() {
    super.initState();

    _repo = OrderRepository(OrderRemoteDataSource());

    _loadReturns();
  }

  Future<void> _loadReturns() async {
    try {
      final orders = await _repo.getOrders();

      final returns = orders.where((o) {
        final status = o.status.toLowerCase();

        return status == "returnapproved" || status == "returned";
      }).toList();

      if (!mounted) return;

      setState(() {
        _returns = returns;
        _isLoading = false;
      });
    } catch (e) {
      print(e);

      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  String _mapStatus(String status) {
    switch (status.toLowerCase()) {
      case "returnapproved":
        return "İADE ONAYLANDI";

      case "returned":
        return "İADE TAMAMLANDI";

      default:
        return status.toUpperCase();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text("İADELERİM"),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _returns.isEmpty
              ? const Center(
                  child: Text("İade bulunamadı"),
                )
              : ListView.separated(
                  padding: const EdgeInsets.all(12),
                  itemCount: _returns.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 12),
                  itemBuilder: (context, index) {
                    final order = _returns[index];

                    final firstItem =
                        order.items.isNotEmpty ? order.items.first : null;

                    return GestureDetector(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => const OrderDetailPage(),
                            settings: RouteSettings(
                              arguments: order.id,
                            ),
                          ),
                        );
                      },
                      child: Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          border: Border.all(
                            color: Colors.grey.shade300,
                          ),
                        ),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              width: 90,
                              height: 110,
                              color: Colors.grey.shade100,
                              child: firstItem != null &&
                                      firstItem.mainImageUrl != null &&
                                      firstItem.mainImageUrl!.isNotEmpty
                                  ? Image.network(
                                      firstItem.mainImageUrl!,
                                      fit: BoxFit.cover,
                                    )
                                  : const Icon(Icons.image),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    _mapStatus(order.status),
                                    style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 13,
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  Text(
                                    firstItem?.productName ?? "",
                                    maxLines: 2,
                                    overflow: TextOverflow.ellipsis,
                                    style: const TextStyle(
                                      fontSize: 14,
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  Text(
                                    "${order.totalAmount.toStringAsFixed(2)} TL",
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
                  },
                ),
    );
  }
}
