class Category {
  final String id;
  final String name;
  final String? description;
  final String? parentId;

  Category({
    required this.id,
    required this.name,
    this.description,
    this.parentId,
  });

  bool get isMainCategory => parentId == null;
  bool get isSubCategory => parentId != null;
}
