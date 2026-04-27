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

  /// 🔥 STRING → INT MAP
  static int _genderFromString(dynamic gender) {
    if (gender is int) return gender;

    switch (gender?.toString().toLowerCase()) {
      case "male":
      case "erkek":
        return 1;
      case "female":
      case "kadın":
        return 2;
      case "unisex":
        return 3;
      default:
        return 0;
    }
  }

  static int _brandFromString(dynamic brand) {
    if (brand is int) return brand;

    switch (brand?.toString().toLowerCase()) {
      case "adidas":
        return 1;
      case "converse":
        return 2;
      case "new balance":
        return 3;
      case "nike":
        return 4;
      case "puma":
        return 5;
      case "vans":
        return 6;
      default:
        return 0;
    }
  }

  factory ProductModel.fromJson(Map<String, dynamic> json) {
    return ProductModel(
      id: json['id']?.toString() ?? '',
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      price: (json['price'] ?? 0).toDouble(),
      stockQuantity: json['stockQuantity'] ?? 0,
      categoryId: json['categoryId']?.toString() ?? '',
      brand: _brandFromString(json['brand']),
      gender: _genderFromString(json['gender']),
      mainImageUrl: json['mainImageUrl'],
      imageUrls:
          (json['imageUrls'] as List?)?.map((e) => e.toString()).toList() ?? [],
    );
  }
}
