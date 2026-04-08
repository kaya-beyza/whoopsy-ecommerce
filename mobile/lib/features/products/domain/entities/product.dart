class Product {
  final String id;
  final String name;
  final String description;
  final double price;
  final int stockQuantity;
  final String categoryId;
  final String? image;

  Product({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.stockQuantity,
    required this.categoryId,
    this.image,
  });
}
