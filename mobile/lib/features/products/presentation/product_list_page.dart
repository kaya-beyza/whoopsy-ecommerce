import 'package:flutter/material.dart';
import 'package:mobile/features/dashboard/presentation/state/cart_service.dart';
import 'package:mobile/features/dashboard/presentation/state/favorite_service.dart';
import 'package:mobile/features/products/data/datasources/product_remote_data_source.dart';
import 'package:mobile/features/products/data/repositories/product_repository_impl.dart';
import 'package:mobile/features/products/domain/entities/product.dart';
import 'package:mobile/features/products/presentation/filter_page.dart';
import 'package:mobile/features/products/presentation/product_detail_page.dart';
import 'package:provider/provider.dart';
import 'package:mobile/features/dashboard/presentation/screens/cart_page.dart';

class ProductListPage extends StatefulWidget {
  final String? categoryId;
  final int? brandId;
  final int? genderId;

  const ProductListPage({
    super.key,
    this.categoryId,
    this.brandId,
    this.genderId,
  });

  @override
  State<ProductListPage> createState() => _ProductListPageState();
}

class _ProductListPageState extends State<ProductListPage> {
  bool _isLoading = true;
  String? _errorMessage;
  List<Product> _products = [];

  late final ProductRepositoryImpl _productRepo;

  int? _selectedGender;
  int? _selectedBrand;
  String? _selectedCategoryId;

  ///  PAGINATION STATE
  int _page = 1;
  bool _hasMore = true;
  bool _isFetchingMore = false;

  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();

    _productRepo = ProductRepositoryImpl(ProductRemoteDataSource());

    _selectedGender = widget.genderId;
    _selectedBrand = widget.brandId;
    _selectedCategoryId = widget.categoryId;

    _scrollController.addListener(_onScroll);

    _fetchProducts();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
            _scrollController.position.maxScrollExtent - 200 &&
        !_isFetchingMore &&
        _hasMore) {
      _loadMore();
    }
  }

  ///  FIRST LOAD
  Future<void> _fetchProducts() async {
    try {
      _page = 1;
      _hasMore = true;

      final response = await _productRepo.getFilteredProducts(
        gender: _selectedGender,
        brand: _selectedBrand,
        categoryId: _selectedCategoryId,
        page: _page,
      );

      setState(() {
        _products = response.items;
        _isLoading = false;
      });

      _hasMore = _products.length < response.totalCount;
    } catch (e) {
      setState(() {
        _errorMessage = e.toString();
        _isLoading = false;
      });
    }
  }

  ///  LOAD MORE
  Future<void> _loadMore() async {
    _isFetchingMore = true;

    try {
      _page++;

      final response = await _productRepo.getFilteredProducts(
        gender: _selectedGender,
        brand: _selectedBrand,
        categoryId: _selectedCategoryId,
        page: _page,
      );

      setState(() {
        _products.addAll(response.items);
      });

      _hasMore = _products.length < response.totalCount;
    } catch (e) {
      print("LOAD MORE ERROR: $e");
    }

    _isFetchingMore = false;
  }

  Future<void> _openFilter() async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => FilterPage(
          initialGender: _selectedGender,
          initialBrand: _selectedBrand,
          initialCategoryId: _selectedCategoryId,
        ),
      ),
    );

    if (result == null) return;

    setState(() {
      _isLoading = true;
    });

    _selectedGender = result["gender"];
    _selectedBrand = result["brand"];
    _selectedCategoryId = result["categoryId"];

    await _fetchProducts();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Ürünler"),
        actions: [
          IconButton(
            icon: const Icon(Icons.tune),
            onPressed: _openFilter,
          ),
        ],
      ),
      body: _buildBody(),
    );
  }

  Widget _buildBody() {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_errorMessage != null) {
      return Center(child: Text(_errorMessage!));
    }

    if (_products.isEmpty) {
      return const Center(child: Text("Ürün bulunamadı"));
    }

    return Column(
      children: [
        Expanded(
          child: GridView.builder(
            controller: _scrollController,
            padding: const EdgeInsets.all(10),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              childAspectRatio: 0.7,
            ),
            itemCount: _products.length,
            itemBuilder: (_, i) => ProductCard(product: _products[i]),
          ),
        ),

        ///  ALT LOADING
        if (_isFetchingMore)
          const Padding(
            padding: EdgeInsets.all(10),
            child: CircularProgressIndicator(),
          ),
      ],
    );
  }
}

class ProductCard extends StatelessWidget {
  final Product product;

  const ProductCard({super.key, required this.product});

  @override
  Widget build(BuildContext context) {
    final favService = context.watch<FavoriteService>();
    final isFav = favService.isFavorite(product.id);

    return SafeArea(
      child: GestureDetector(
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => ProductDetailPage(product: product),
            ),
          );
        },
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Stack(
                children: [
                  Positioned.fill(
                    child: Image.network(
                      product.mainImageUrl ?? "",
                      fit: BoxFit.cover,
                    ),
                  ),
                  Positioned(
                    right: 4,
                    bottom: 4,
                    child: Column(
                      children: [
                        _iconButton(
                          icon: Icons.shopping_bag_outlined,
                          onTap: () async {
                            try {
                              await context
                                  .read<CartService>()
                                  .addToCart(product.id);

                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  behavior: SnackBarBehavior.floating,
                                  backgroundColor: Colors.black,
                                  elevation: 0,
                                  margin: const EdgeInsets.symmetric(
                                      horizontal: 12, vertical: 12),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(
                                        4), // çok yuvarlak değil
                                  ),
                                  duration: const Duration(seconds: 2),
                                  content: Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    children: [
                                      /// SOL TEXT
                                      const Text(
                                        "SEPETE EKLENDİ",
                                        style: TextStyle(
                                          color: Colors.white,
                                          fontWeight: FontWeight.w700,
                                          fontSize: 13,
                                          letterSpacing: 0.5,
                                        ),
                                      ),

                                      /// SAĞ CTA
                                      GestureDetector(
                                        onTap: () {
                                          Navigator.push(
                                            context,
                                            MaterialPageRoute(
                                              builder: (_) => CartPage(),
                                            ),
                                          );
                                        },
                                        child: const Text(
                                          "SEPETE GİT →",
                                          style: TextStyle(
                                            color: Colors.white,
                                            fontWeight: FontWeight.bold,
                                            fontSize: 13,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              );
                            } catch (e) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  backgroundColor: Colors.black,
                                  content: Text(
                                    "HATA OLUŞTU",
                                    style: TextStyle(color: Colors.white),
                                  ),
                                ),
                              );
                            }
                          },
                        ),
                        const SizedBox(height: 4),
                        _iconButton(
                          icon: isFav ? Icons.favorite : Icons.favorite_border,
                          onTap: () {
                            context
                                .read<FavoriteService>()
                                .toggleFavorite(product.id);
                          },
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 6),
            Text(product.name, maxLines: 1, overflow: TextOverflow.ellipsis),
            const SizedBox(height: 4),
            Text("${product.price} ₺"),
          ],
        ),
      ),
    );
  }

  Widget _iconButton({
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 34,
        height: 34,
        decoration: BoxDecoration(
          color: Colors.black.withOpacity(0.3),
          shape: BoxShape.circle,
        ),
        child: Icon(icon, size: 18, color: Colors.white),
      ),
    );
  }
}
