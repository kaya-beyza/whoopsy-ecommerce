import '../../domain/entities/product.dart';

class ProductModel extends Product {
  ProductModel({
    required super.id,
    required super.name,
    required super.description,
    required super.price,
    required super.stockQuantity,
    required super.categoryId,
    required super.brand,
    required super.gender,
    super.mainImageUrl,
    super.imageUrls,
  });

  factory ProductModel.fromJson(Map<String, dynamic> json) {
    return ProductModel(
      // ✅ ID her zaman string'e çevrilmeli (backend Guid olabilir)
      id: json['id']?.toString() ?? '',

      name: json['name'] ?? '',
      description: json['description'] ?? '',

      // ✅ NULL SAFE + TYPE SAFE
      price: (json['price'] ?? 0).toDouble(),

      stockQuantity: json['stockQuantity'] ?? 0,

      // ✅ önemli: backend Guid/string olabilir
      categoryId: json['categoryId']?.toString() ?? '',
      brand: json['brand'] ?? 0,
      gender: json['gender'] ?? 0,
      // ✅ null gelebilir → güvenli bırak
      mainImageUrl: json['mainImageUrl'],

      // ✅ liste null ise boş liste
      imageUrls:
          (json['imageUrls'] as List?)?.map((e) => e.toString()).toList() ?? [],
    );
  }
}
