class Product {
  final String id;
  final String name;
  final String description;
  final double price;
  final int stockQuantity;

  final String categoryId; // backend Guid → String olarak tutuyoruz
  final int brand; // 🔥 EKLENDİ (çok önemli)
  final int gender;
  final String? mainImageUrl;
  final List<String> imageUrls;

  Product({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.stockQuantity,
    required this.categoryId,
    required this.brand,
    required this.gender,
    this.mainImageUrl,
    this.imageUrls = const [],
  });

  // 🔥 JSON → Model
  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'],
      name: json['name'],
      description: json['description'] ?? '',
      price: (json['price'] as num).toDouble(),
      stockQuantity: json['stockQuantity'],
      categoryId: json['categoryId'],
      brand: json['brand'], // 🔥 önemli
      gender: json['gender'] ?? 0,
      mainImageUrl: json['mainImageUrl'],
      imageUrls: (json['imageUrls'] as List<dynamic>?)
              ?.map((e) => e.toString())
              .toList() ??
          [],
    );
  }
}
