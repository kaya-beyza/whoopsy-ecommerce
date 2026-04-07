import 'package:flutter/material.dart';
import 'package:collection/collection.dart'; // firstWhereOrNull için gerekli (pubspec'e ekle)

import '../../categories/data/datasources/category_remote_data_source.dart';
import '../../categories/data/repositories/category_repository_impl.dart';
import '../../categories/domain/usecases/get_categories_usecase.dart';
import '../../products/data/datasources/product_remote_data_source.dart';
import '../../products/data/repositories/product_repository_impl.dart';
import '../../products/domain/usecases/get_products_by_category_usecase.dart';

class CategoryProductsPage extends StatefulWidget {
  final String categoryName;

  const CategoryProductsPage({super.key, required this.categoryName});

  @override
  State<CategoryProductsPage> createState() => _CategoryProductsPageState();
}

class _CategoryProductsPageState extends State<CategoryProductsPage> {
  bool _isLoading = true;
  String? _errorMessage;
  List<dynamic> _products = [];

  // UseCase tanımlamaları
  late final GetCategoriesUseCase _getCategoriesUseCase;
  late final GetProductsByCategoryUseCase _getProductsByCategoryUseCase;

  @override
  void initState() {
    super.initState();
    _setupDependencies(); // Katmanları birbirine bağlıyoruz
    _fetchProductsByMatchingName();
  }

  void _setupDependencies() {
    // 1. Kategori katmanlarını bağla
    final categoryDataSource = CategoryRemoteDataSource();
    final categoryRepo = CategoryRepositoryImpl(categoryDataSource);
    _getCategoriesUseCase = GetCategoriesUseCase(categoryRepo);

    // 2. Ürün katmanlarını bağla
    final productDataSource = ProductRemoteDataSource();
    final productRepo = ProductRepositoryImpl(productDataSource);
    _getProductsByCategoryUseCase = GetProductsByCategoryUseCase(productRepo);
  }

  Future<void> _fetchProductsByMatchingName() async {
    try {
      setState(() {
        _isLoading = true;
        _errorMessage = null;
      });

      // ADIM 1: Backend'den tüm kategorileri çek
      final categories = await _getCategoriesUseCase.execute();

      // ADIM 2: İsim eşleşmesi yap (Çanta-Aksesuar vs Çanta)
      // firstWhereOrNull hata fırlatmaz, bulamazsa null döner
      final matchedCategory = categories.firstWhereOrNull((cat) =>
          cat.name
              .toLowerCase()
              .contains(widget.categoryName.toLowerCase().trim()) ||
          widget.categoryName
              .toLowerCase()
              .contains(cat.name.toLowerCase().trim()));

      if (matchedCategory != null) {
        // ADIM 3: Bulunan ID ile ürünleri çek
        final products =
            await _getProductsByCategoryUseCase.execute(matchedCategory.id);

        setState(() {
          _products = products;
          _isLoading = false;
        });
      } else {
        setState(() {
          _errorMessage =
              "'${widget.categoryName}' kategorisi veritabanında bulunamadı.";
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage =
            "Bağlantı hatası: Backend'e ulaşılamadı.\n${e.toString()}";
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        title: Text(widget.categoryName.toUpperCase(),
            style: const TextStyle(
                color: Colors.black, fontWeight: FontWeight.bold)),
        centerTitle: true,
        backgroundColor: Colors.white,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.black),
      ),
      body: _buildBody(),
    );
  }

  Widget _buildBody() {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_errorMessage != null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.cloud_off, size: 60, color: Colors.grey),
              const SizedBox(height: 16),
              Text(_errorMessage!,
                  textAlign: TextAlign.center,
                  style: const TextStyle(fontSize: 16, color: Colors.red)),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: _fetchProductsByMatchingName,
                child: const Text("Tekrar Dene"),
              )
            ],
          ),
        ),
      );
    }

    if (_products.isEmpty) {
      return const Center(
          child: Text("Bu kategoride henüz ürün bulunmuyor.",
              style: TextStyle(fontSize: 16, color: Colors.grey)));
    }

    return GridView.builder(
      padding: const EdgeInsets.all(16),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        childAspectRatio: 0.68,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
      ),
      itemCount: _products.length,
      itemBuilder: (context, index) {
        return _ProductCard(product: _products[index]);
      },
    );
  }
}

class _ProductCard extends StatelessWidget {
  final dynamic product;
  const _ProductCard({required this.product});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        boxShadow: [
          BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, 5))
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: ClipRRect(
              borderRadius:
                  const BorderRadius.vertical(top: Radius.circular(15)),
              child: Image.network(
                product.image ?? "https://via.placeholder.com/150",
                fit: BoxFit.cover,
                width: double.infinity,
                errorBuilder: (context, error, stackTrace) =>
                    const Center(child: Icon(Icons.image_not_supported)),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  product.name,
                  style: const TextStyle(
                      fontWeight: FontWeight.bold, fontSize: 14),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 6),
                Text(
                  "${product.price} TL",
                  style: TextStyle(
                      color: Theme.of(context).primaryColor,
                      fontWeight: FontWeight.w900,
                      fontSize: 16),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
