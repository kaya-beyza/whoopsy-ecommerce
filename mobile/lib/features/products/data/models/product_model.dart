import '../../domain/entities/product.dart';

class ProductModel extends Product {
  ProductModel({
    required super.id,
    required super.name,
    required super.price,
    super.image,
  });

  // Backend'den gelen JSON'ı okuyan kısım
  factory ProductModel.fromJson(Map<String, dynamic> json) {
    return ProductModel(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      // C#'tan gelen decimal/double farkını önlemek için num kullanıyoruz
      price: (json['price'] as num).toDouble(),
      image: json['image'],
    );
  }
}
