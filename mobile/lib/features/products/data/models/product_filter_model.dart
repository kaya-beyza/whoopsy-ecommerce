class ProductFilter {
  final double minPrice;
  final double maxPrice;
  final int? gender;
  final int? brand;
  final String? categoryId;

  ProductFilter({
    required this.minPrice,
    required this.maxPrice,
    this.gender,
    this.brand,
    this.categoryId,
  });
}
