import 'package:flutter/material.dart';

class CategoryProductsPage extends StatelessWidget {
  final String categoryName;
  const CategoryProductsPage({super.key, required this.categoryName});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(categoryName)),
      body: Center(child: Text("$categoryName ürünleri burada listelenecek")),
      // Burada muhtemelen bir BlocBuilder veya FutureBuilder ile
      // backend'den gelen veriyi listeleyeceksiniz.
    );
  }
}
