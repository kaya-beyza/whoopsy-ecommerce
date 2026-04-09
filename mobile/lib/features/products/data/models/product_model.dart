import '../../domain/entities/product.dart';

class ProductModel extends Product {
  ProductModel({
    required super.id,
    required super.name,
    required super.description,
    required super.price,
    required super.stockQuantity,
    required super.categoryId,
    super.mainImageUrl,
    super.imageUrls,
  });

  factory ProductModel.fromJson(Map<String, dynamic> json) {
    return ProductModel(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      price: (json['price'] as num).toDouble(),
      stockQuantity: json['stockQuantity'] ?? 0,
      categoryId: json['categoryId'] ?? '',

      // 🔥 BACKEND MAPPING
      mainImageUrl: json['mainImageUrl'],
      imageUrls: List<String>.from(json['imageUrls'] ?? []),
    );
  }
}
