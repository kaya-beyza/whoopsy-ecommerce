class Category {
  final String id;
  final String name;
  final String? description;
  final String? parentId;

  final List<Category> subCategories; //  eklendi

  Category({
    required this.id,
    required this.name,
    this.description,
    this.parentId,
    this.subCategories = const [],
  });

  bool get isMainCategory => parentId == null;
  bool get isSubCategory => parentId != null;
}
