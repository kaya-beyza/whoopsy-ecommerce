import '../datasources/order_remote_data_source.dart';
import '../models/order_model.dart';

class OrderRepository {
  final OrderRemoteDataSource remote;

  OrderRepository(this.remote);

  /// 🔹 LIST
  Future<List<OrderModel>> getOrders() async {
    final token = await remote.local.getToken();
    final userId = extractUserId(token!);
    print("USER ID FROM TOKEN: $userId");
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

  Future<void> createPayment({
    required String orderId,
    required String cardHolderName,
    required String cardNumber,
    required String expireMonth,
    required String expireYear,
    required String cvc,
    required String buyerName,
    required String buyerSurname,
    required String buyerEmail,
    required String buyerPhone,
    required String buyerAddress,
    required String buyerCity,
  }) async {
    await remote.createPayment(
      orderId: orderId,
      cardHolderName: cardHolderName,
      cardNumber: cardNumber,
      expireMonth: expireMonth,
      expireYear: expireYear,
      cvc: cvc,
      buyerName: buyerName,
      buyerSurname: buyerSurname,
      buyerEmail: buyerEmail,
      buyerPhone: buyerPhone,
      buyerAddress: buyerAddress,
      buyerCity: buyerCity,
    );
  }
}
