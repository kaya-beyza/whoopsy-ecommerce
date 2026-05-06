class OrderModel {
  final String id;
  final double totalAmount;
  final String status;
  final String shippingAddress;
  final DateTime createdDate;
  final List<OrderItemModel> items;

  OrderModel({
    required this.id,
    required this.totalAmount,
    required this.status,
    required this.shippingAddress,
    required this.createdDate,
    required this.items,
  });

  factory OrderModel.fromJson(dynamic json) {
    final data = Map<String, dynamic>.from(json);

    return OrderModel(
      id: data["id"].toString(),
      totalAmount: (data["totalAmount"] ?? 0).toDouble(),
      status: data["status"] ?? 0,
      shippingAddress: data["shippingAddress"] ?? "",
      createdDate: DateTime.parse(data["createdDate"]),
      items: (data["orderItems"] as List? ?? [])
          .map((e) => OrderItemModel.fromJson(e))
          .toList(),
    );
  }
}

class OrderItemModel {
  final String productId;
  final String productName;
  final int quantity;
  final double totalPrice;

  OrderItemModel({
    required this.productId,
    required this.productName,
    required this.quantity,
    required this.totalPrice,
  });

  factory OrderItemModel.fromJson(dynamic json) {
    final data = Map<String, dynamic>.from(json);

    return OrderItemModel(
      productId: data["productId"].toString(),
      productName: data["productName"] ?? "",
      quantity: data["quantity"] ?? 0,
      totalPrice: (data["totalPrice"] ?? 0).toDouble(),
    );
  }
}
