class PagedResponse<T> {
  final List<T> items;
  final int page;
  final int pageSize;
  final int totalCount;

  PagedResponse({
    required this.items,
    required this.page,
    required this.pageSize,
    required this.totalCount,
  });
}
