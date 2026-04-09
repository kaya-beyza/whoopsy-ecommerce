class Product {
  final String id;
  final String name;
  final String description;
  final double price;
  final int stockQuantity;
  final String categoryId;
  final String? mainImageUrl;
  final List<String> imageUrls;

  Product({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.stockQuantity,
    required this.categoryId,
    this.mainImageUrl,
    this.imageUrls = const [],
  });
}
