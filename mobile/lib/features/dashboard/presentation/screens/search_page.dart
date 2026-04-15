import 'package:flutter/material.dart';
import 'package:mobile/features/products/data/datasources/product_remote_data_source.dart';
import 'package:mobile/features/products/data/repositories/product_repository_impl.dart';
import 'package:mobile/features/products/domain/entities/product.dart';
import 'package:mobile/features/products/presentation/product_detail_page.dart';

class SearchPage extends StatefulWidget {
  const SearchPage({super.key});

  @override
  State<SearchPage> createState() => _SearchPageState();
}

class _SearchPageState extends State<SearchPage> {
  final TextEditingController _controller = TextEditingController();

  late final ProductRepositoryImpl _repo;

  List<Product> _products = [];
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _repo = ProductRepositoryImpl(ProductRemoteDataSource());
    _loadInitial();
  }

  /// 🔥 BAŞLANGIÇ → öneriler
  Future<void> _loadInitial() async {
    setState(() => _isLoading = true);

    try {
      // 🔥 farklı sayfalardan çek
      final page1 = await _repo.getFilteredProducts(page: 1);
      final page2 = await _repo.getFilteredProducts(page: 2);
      final page3 = await _repo.getFilteredProducts(page: 3);

      final combined = [
        ...page1,
        ...page2,
        ...page3,
      ];

      combined.shuffle(); // 🔥 karıştır

      setState(() {
        _products = combined.take(10).toList();
        _isLoading = false;
      });
    } catch (e) {
      print("INIT ERROR: $e");
      setState(() => _isLoading = false);
    }
  }

  /// 🔥 SEARCH LOGIC
  Future<void> _search(String query) async {
    if (query.trim().isEmpty) {
      _loadInitial();
      return;
    }

    setState(() => _isLoading = true);

    try {
      final result = await _repo.getFilteredProducts(
        searchTerm: query.trim(),
      );

      setState(() {
        _products = result;
        _isLoading = false;
      });
    } catch (e) {
      print("SEARCH ERROR: $e");
      setState(() => _isLoading = false);
    }
  }

  /// 🔥 BRAND TEXT
  String _brandToText(int? brand) {
    switch (brand) {
      case 1:
        return "adidas";
      case 2:
        return "converse";
      case 3:
        return "new balance";
      case 4:
        return "nike";
      case 5:
        return "puma";
      case 6:
        return "vans";
      default:
        return "";
    }
  }

  /// 🔥 GENDER TEXT
  String _genderToText(int? gender) {
    switch (gender) {
      case 1:
        return "erkek";
      case 2:
        return "kadın";
      case 3:
        return "çocuk";
      default:
        return "";
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            /// 🔍 SEARCH BAR
            Padding(
              padding: const EdgeInsets.all(12),
              child: Row(
                children: [
                  Expanded(
                    child: Container(
                      height: 45,
                      padding: const EdgeInsets.symmetric(horizontal: 10),
                      decoration: BoxDecoration(
                        border: Border.all(color: Colors.black),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.search),
                          const SizedBox(width: 8),
                          Expanded(
                            child: TextField(
                              controller: _controller,
                              onChanged: _search,
                              decoration: const InputDecoration(
                                hintText: "BURADA ARA",
                                border: InputBorder.none,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  GestureDetector(
                    onTap: () {
                      FocusScope.of(context).unfocus(); // klavye kapanır
                      _controller.clear();
                      _search("");
                    },
                    child: const Text(
                      "İPTAL ET",
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ),
                  )
                ],
              ),
            ),

            const SizedBox(height: 10),

            const Text(
              "İLGİNİ ÇEKEBİLİR",
              style: TextStyle(fontWeight: FontWeight.bold),
            ),

            const SizedBox(height: 10),

            Expanded(
              child: _isLoading
                  ? const Center(child: CircularProgressIndicator())
                  : GridView.builder(
                      padding: const EdgeInsets.all(10),
                      gridDelegate:
                          const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        childAspectRatio: 0.7,
                      ),
                      itemCount: _products.length,
                      itemBuilder: (_, i) {
                        final p = _products[i];

                        return GestureDetector(
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => ProductDetailPage(product: p),
                              ),
                            );
                          },
                          child: Card(
                            child: Column(
                              children: [
                                Expanded(
                                  child: Image.network(
                                    p.mainImageUrl ?? "",
                                    fit: BoxFit.cover,
                                    width: double.infinity,
                                  ),
                                ),
                                Padding(
                                  padding: const EdgeInsets.all(6),
                                  child: Text(
                                    p.name,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                                Text("${p.price} ₺"),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
            )
          ],
        ),
      ),
    );
  }
}
