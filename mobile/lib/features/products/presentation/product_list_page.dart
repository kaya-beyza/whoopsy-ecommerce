import 'package:flutter/material.dart';
import 'package:mobile/features/categories/data/datasources/category_remote_data_source.dart';
import 'package:mobile/features/products/data/datasources/product_remote_data_source.dart';
import 'package:mobile/features/products/data/models/product_model.dart';
import 'package:mobile/features/products/data/repositories/product_repository_impl.dart';
import 'package:mobile/features/products/domain/entities/product.dart';
import 'package:mobile/features/products/presentation/filter_page.dart';
import 'package:mobile/features/products/presentation/product_detail_page.dart';

class ProductListPage extends StatefulWidget {
  final String? categoryId;
  final int? brandId;
  final int? genderId;
  final String? mainCategoryName;

  const ProductListPage({
    super.key,
    this.categoryId,
    this.brandId,
    this.genderId,
    this.mainCategoryName,
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

  bool _hasUserAppliedFilter = false;

  @override
  void initState() {
    super.initState();
    _setup();

    _selectedGender = widget.genderId;
    _selectedBrand = widget.brandId;
    _selectedCategoryId = widget.categoryId;

    _fetchProducts();
  }

  void _setup() {
    final dataSource = ProductRemoteDataSource();
    _productRepo = ProductRepositoryImpl(dataSource);
  }

  Future<void> _fetchProducts() async {
    try {
      print("CATEGORY: $_selectedCategoryId");
      print("BRAND: $_selectedBrand");
      print("GENDER: $_selectedGender");
      List<Product> result = [];

      /// 1️⃣ GENDER + optional category
      if (_selectedGender != null) {
        result = await _productRepo.getProductsByGender(
          _selectedGender!,
          categoryId: _selectedCategoryId,
        );
      }

      /// 2️⃣ CATEGORY
      else if (_selectedCategoryId != null) {
        final categoryDataSource = CategoryRemoteDataSource();
        final categoryTree = await categoryDataSource.getCategoryTree();
        final treeList = categoryTree.cast<Map<String, dynamic>>();

        final selectedMainCategory = treeList.firstWhere(
          (c) => c["id"] == _selectedCategoryId,
          orElse: () => <String, dynamic>{},
        );

        if (selectedMainCategory.isNotEmpty) {
          final subCategories =
              (selectedMainCategory["subCategories"] as List? ?? [])
                  .cast<Map<String, dynamic>>();

          if (subCategories.isEmpty) {
            result = [];
          } else {
            final futures = subCategories.map((sub) {
              return _productRepo.getProductsByCategoryId(sub["id"]);
            }).toList();

            final results = await Future.wait(futures);

            final temp = <Product>[];
            for (final list in results) {
              temp.addAll(list);
            }

            result = {
              for (final p in temp) p.id: p,
            }.values.toList();
          }
        } else {
          // alt kategori ise direkt kendi ürünleri
          result = await _productRepo.getProductsByCategoryId(
            _selectedCategoryId!,
          );
        }
      }

      /// 3️⃣ BRAND ONLY
      else if (_selectedBrand != null) {
        print("SELECTED BRAND: $_selectedBrand");

        final data = await _productRepo.getProductsByBrand(
          _selectedBrand!,
        );

        result = data;

        print("RESULT COUNT: ${result.length}");
      }

      /// 4️⃣ ALL
      else {
        result = await _productRepo.getAllProducts();
      }

      /// 5️⃣ FRONTEND BRAND FILTER
      if (_selectedBrand != null) {
        result = result.where((p) => p.brand == _selectedBrand).toList();
      }

      setState(() {
        _products = result;
        _isLoading = false;
      });
    } catch (e) {
      print("ERROR: $e");
      print("SELECTED BRAND: $_selectedBrand");

      setState(() {
        _errorMessage = e.toString();
        _isLoading = false;
      });
    }
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

    // 🔥 1. loading başlat
    setState(() {
      _isLoading = true;
    });

    // 🔥 2. state güncelle
    _selectedGender = result["gender"];
    _selectedBrand = result["brand"];
    _selectedCategoryId = result["categoryId"];
    _hasUserAppliedFilter = true;

    // 🔥 3. fetch et
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
            Expanded(
              child: product.mainImageUrl != null &&
                      product.mainImageUrl!.isNotEmpty
                  ? Image.network(
                      product.mainImageUrl!,
                      fit: BoxFit.cover,
                      width: double.infinity,
                    )
                  : Container(
                      color: Colors.grey.shade200,
                      child: const Center(child: Icon(Icons.image)),
                    ),
            ),
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
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
            const SizedBox(height: 6),
          ],
        ),
      ),
    );
  }
}
