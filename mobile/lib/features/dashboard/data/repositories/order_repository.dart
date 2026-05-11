import '../datasources/order_remote_data_source.dart';
import '../models/order_model.dart';

class OrderRepository {
  final OrderRemoteDataSource remote;

  OrderRepository(this.remote);

  /// 🔹 LIST
  Future<List<OrderModel>> getOrders() async {
    final token = await remote.local.getToken();
    final userId = extractUserId(token!);

    final response = await remote.getOrders(userId);

    return response.map<OrderModel>((e) => OrderModel.fromJson(e)).toList();
  }

  /// 🔹 DETAIL (LIST İÇİNDEN BUL)
  Future<OrderModel> getOrderDetail(String id) async {
    final json = await remote.getOrderDetail(id);
    return OrderModel.fromJson(json);
  }

  Future<void> updateOrderStatus({
    required String orderId,
    required String status,
  }) async {
    await remote.updateOrderStatus(
      orderId: orderId,
      status: status,
    );
  }
}
