import 'package:flutter/material.dart';
import 'package:mobile/features/products/data/datasources/product_remote_data_source.dart';
import 'package:mobile/features/products/data/repositories/product_repository_impl.dart';
import 'package:mobile/features/products/domain/entities/product.dart';
import 'package:mobile/features/products/presentation/product_detail_page.dart';

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

  @override
  void initState() {
    super.initState();
    _setup();
    _fetchProducts();
  }

  void _setup() {
    final dataSource = ProductRemoteDataSource();
    _productRepo = ProductRepositoryImpl(dataSource);
  }

  Future<void> _fetchProducts() async {
    try {
      List<Product> result;

      if (widget.genderId != null) {
        result = await _productRepo.getProductsByGender(
          widget.genderId!,
          categoryId: widget.categoryId,
        );
      } else if (widget.categoryId != null) {
        result = await _productRepo.getProductsByCategoryId(
          widget.categoryId!,
        );
      } else {
        result = await _productRepo.getAllProducts();
      }

      if (widget.brandId != null) {
        result = result.where((p) => p.brand == widget.brandId).toList();
      }

      setState(() {
        _products = result;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _errorMessage = e.toString();
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Ürünler"),
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

    return GridView.builder(
      padding: const EdgeInsets.all(10),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        childAspectRatio: 0.7,
      ),
      itemCount: _products.length,
      itemBuilder: (_, i) => ProductCard(product: _products[i]),
    );
  }
}

class ProductCard extends StatelessWidget {
  final Product product;

  const ProductCard({super.key, required this.product});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => ProductDetailPage(product: product),
          ),
        );
      },
      child: Card(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 🔥 IMAGE
            Expanded(
              child: Stack(
                children: [
                  Positioned.fill(
                    child: Image.network(
                      product.mainImageUrl ?? "",
                      fit: BoxFit.cover,
                    ),
                  ),

                  // ❤️ FAVORITE
                  Positioned(
                    top: 8,
                    right: 8,
                    child: Icon(Icons.favorite_border, size: 20),
                  ),
                ],
              ),
            ),

            // 🔥 TEXT
            Padding(
              padding: const EdgeInsets.all(8),
              child: Text(
                product.name,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ),

            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8),
              child: Text(
                "${product.price} ₺",
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),

            const SizedBox(height: 6),
          ],
        ),
      ),
    );
  }
}
