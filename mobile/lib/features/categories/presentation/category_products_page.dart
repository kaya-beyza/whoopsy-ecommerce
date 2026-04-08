import 'package:flutter/material.dart';
import 'package:collection/collection.dart';
import 'package:mobile/features/products/presentation/product_detail_page.dart';

import '../../categories/data/datasources/category_remote_data_source.dart';
import '../../categories/data/repositories/category_repository_impl.dart';
import '../../categories/domain/usecases/get_categories_usecase.dart';
import '../../products/data/datasources/product_remote_data_source.dart';
import '../../products/data/repositories/product_repository_impl.dart';
import '../../products/domain/usecases/get_products_by_category_usecase.dart';
import '../../products/domain/entities/product.dart';

class CategoryProductsPage extends StatefulWidget {
  final String categoryName;

  const CategoryProductsPage({super.key, required this.categoryName});

  @override
  State<CategoryProductsPage> createState() => _CategoryProductsPageState();
}

class _CategoryProductsPageState extends State<CategoryProductsPage> {
  bool _isLoading = true;
  String? _errorMessage;
  List<Product> _products = [];

  late final GetCategoriesUseCase _getCategoriesUseCase;
  late final GetProductsByCategoryUseCase _getProductsUseCase;

  @override
  void initState() {
    super.initState();
    _setupDependencies();
    _fetchProductsByMatchingName();
  }

  void _setupDependencies() {
    final categoryDataSource = CategoryRemoteDataSource();
    final categoryRepo = CategoryRepositoryImpl(categoryDataSource);
    _getCategoriesUseCase = GetCategoriesUseCase(categoryRepo);

    final productDataSource = ProductRemoteDataSource();
    final productRepo = ProductRepositoryImpl(productDataSource);
    _getProductsUseCase = GetProductsByCategoryUseCase(productRepo);
  }

  Future<void> _fetchProductsByMatchingName() async {
    try {
      print("START");

      final categories = await _getCategoriesUseCase.execute();
      print("CATEGORIES: $categories");

      final matchedCategory = categories.firstWhereOrNull((cat) =>
          cat.name.toLowerCase().contains(widget.categoryName.toLowerCase()));

      print("MATCHED: $matchedCategory");

      if (matchedCategory == null) {
        print("CATEGORY BULUNAMADI");

        setState(() {
          _errorMessage = "Kategori bulunamadı";
          _isLoading = false;
        });
        return;
      }

      print("PRODUCT API ÇAĞRILIYOR");

      final allProducts = await _getProductsUseCase.execute(matchedCategory.id);

      print("PRODUCTS: $allProducts");

      setState(() {
        _products = allProducts;
        _isLoading = false;
      });
    } catch (e) {
      print("HATA: $e");

      setState(() {
        _errorMessage = e.toString();
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Text(widget.categoryName.toUpperCase(),
            style: const TextStyle(
                color: Colors.black, fontWeight: FontWeight.bold)),
        centerTitle: true,
        backgroundColor: Colors.white,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.black),
      ),
      body: Column(
        children: [
          _buildTopBar(),
          Expanded(child: _buildBody()),
        ],
      ),
    );
  }

  Widget _buildTopBar() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      child: Row(
        children: [
          Expanded(
            child: Container(
              height: 40,
              padding: const EdgeInsets.symmetric(horizontal: 12),
              decoration: BoxDecoration(
                color: Colors.grey[200],
                borderRadius: BorderRadius.circular(20),
              ),
              child: Row(
                children: const [
                  Icon(Icons.search, size: 18),
                  SizedBox(width: 8),
                  Text("Ara", style: TextStyle(color: Colors.grey)),
                ],
              ),
            ),
          ),
          const SizedBox(width: 10),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: Colors.black,
              borderRadius: BorderRadius.circular(10),
            ),
            child:
                const Text("Filtreler", style: TextStyle(color: Colors.white)),
          )
        ],
      ),
    );
  }

  Widget _buildBody() {
    if (_isLoading) {
      return GridView.builder(
        itemCount: 6,
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          childAspectRatio: 0.72,
        ),
        itemBuilder: (_, __) => Container(
          margin: const EdgeInsets.all(8),
          color: Colors.grey[300],
        ),
      );
    }

    if (_errorMessage != null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.cloud_off, size: 60, color: Colors.grey),
            const SizedBox(height: 16),
            Text(_errorMessage!, style: const TextStyle(color: Colors.red)),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: _fetchProductsByMatchingName,
              child: const Text("Tekrar Dene"),
            )
          ],
        ),
      );
    }

    if (_products.isEmpty) {
      return const Center(child: Text("Ürün bulunamadı"));
    }

    return GridView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        childAspectRatio: 0.58,
        crossAxisSpacing: 10,
        mainAxisSpacing: 16,
      ),
      itemCount: _products.length,
      itemBuilder: (context, index) {
        return _ProductCard(product: _products[index]);
      },
    );
  }
}

class _ProductCard extends StatelessWidget {
  final Product product;

  const _ProductCard({required this.product});

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
      child: Container(
        color: Colors.white,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Stack(
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(12),
                    child: SizedBox(
                      width: double.infinity,
                      height: double.infinity,
                      child: Image.network(
                        (product.image != null && product.image!.isNotEmpty)
                            ? product.image!
                            : "https://i.pinimg.com/736x/64/1f/70/641f70be1b77ce5f433819372de8cbed.jpg",
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                  Positioned(
                    top: 8,
                    right: 8,
                    child: Container(
                      width: 34,
                      height: 34,
                      decoration: const BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.favorite_border, size: 18),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 8),
            Text(
              product.name,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 4),
            Text(
              "${product.price.toStringAsFixed(0)} TL",
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ),
    );
  }
}
