import 'package:flutter/material.dart';
import 'package:mobile/features/categories/data/datasources/category_remote_data_source.dart';

const genderMap = {
  0: "Cinsiyetsiz",
  1: "Erkek",
  2: "Kadın",
  3: "Çocuk",
};

const brands = [
  {"id": 1, "name": "Adidas"},
  {"id": 2, "name": "Converse"},
  {"id": 3, "name": "New Balance"},
  {"id": 4, "name": "Nike"},
  {"id": 5, "name": "Puma"},
  {"id": 6, "name": "Vans"},
];

class FilterPage extends StatefulWidget {
  final int? initialGender;
  final int? initialBrand;
  final String? initialCategoryId;

  const FilterPage({
    super.key,
    this.initialGender,
    this.initialBrand,
    this.initialCategoryId,
  });

  @override
  State<FilterPage> createState() => _FilterPageState();
}

class _FilterPageState extends State<FilterPage> {
  final categoryDataSource = CategoryRemoteDataSource();

  List<dynamic> categories = [];
  bool isLoading = true;

  int? selectedGender;
  int? selectedBrand;
  String? selectedCategoryId;

  bool genderExpanded = false;
  bool categoryExpanded = false;
  bool brandExpanded = false;

  @override
  void initState() {
    super.initState();
    selectedGender = widget.initialGender;
    selectedBrand = widget.initialBrand;
    selectedCategoryId = widget.initialCategoryId;
    _loadCategories();
  }

  Future<void> _loadCategories() async {
    try {
      final data = await categoryDataSource.getAllCategories();

      setState(() {
        categories = data;
        isLoading = false;
      });

      print("CATEGORIES: $categories");
    } catch (e) {
      print("CATEGORY ERROR: $e");
      setState(() {
        isLoading = false;
      });
    }
  }

  void _toggleSection(String section) {
    setState(() {
      if (section == "gender") {
        genderExpanded = !genderExpanded;
      } else if (section == "category") {
        categoryExpanded = !categoryExpanded;
      } else if (section == "brand") {
        brandExpanded = !brandExpanded;
      }
    });
  }

  Widget _buildSectionHeader({
    required String title,
    required bool expanded,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 18),
        child: Row(
          children: [
            Expanded(
              child: Text(
                title.toUpperCase(),
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
            Icon(
              expanded ? Icons.keyboard_arrow_up : Icons.keyboard_arrow_down,
              color: Colors.black,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDivider() {
    return const Divider(height: 1, thickness: 1);
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return const Scaffold(
        backgroundColor: Colors.white,
        body: Center(child: CircularProgressIndicator()),
      );
    }

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text(
          "FİLTRELE",
          style: TextStyle(
            color: Colors.black,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
        backgroundColor: Colors.white,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.black),
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              children: [
                _buildSectionHeader(
                  title: "Cinsiyet",
                  expanded: genderExpanded,
                  onTap: () => _toggleSection("gender"),
                ),
                if (genderExpanded)
                  Column(
                    children: genderMap.entries.map((entry) {
                      return RadioListTile<int>(
                        value: entry.key,
                        groupValue: selectedGender,
                        title: Text(entry.value),
                        activeColor: Colors.black,
                        contentPadding: EdgeInsets.zero,
                        onChanged: (val) {
                          setState(() {
                            selectedGender = val;
                          });
                        },
                      );
                    }).toList(),
                  ),
                _buildDivider(),
                _buildSectionHeader(
                  title: "Kategori",
                  expanded: categoryExpanded,
                  onTap: () => _toggleSection("category"),
                ),
                if (categoryExpanded)
                  Column(
                    children: categories.map((c) {
                      return RadioListTile<String>(
                        value: c["id"],
                        groupValue: selectedCategoryId,
                        title: Text(c["name"]),
                        activeColor: Colors.black,
                        contentPadding: EdgeInsets.zero,
                        onChanged: (val) {
                          setState(() {
                            selectedCategoryId = val;
                          });
                        },
                      );
                    }).toList(),
                  ),
                _buildDivider(),
                _buildSectionHeader(
                  title: "Marka",
                  expanded: brandExpanded,
                  onTap: () => _toggleSection("brand"),
                ),
                if (brandExpanded)
                  Column(
                    children: brands.map((b) {
                      return RadioListTile<int>(
                        value: b["id"] as int,
                        groupValue: selectedBrand,
                        title: Text(b["name"] as String),
                        activeColor: Colors.black,
                        contentPadding: EdgeInsets.zero,
                        onChanged: (val) {
                          setState(() {
                            selectedBrand = val;
                          });
                        },
                      );
                    }).toList(),
                  ),
                _buildDivider(),
                const SizedBox(height: 100),
              ],
            ),
          ),
          Container(
            color: Colors.white,
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 20),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                SizedBox(
                  width: double.infinity,
                  height: 52,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.black,
                      foregroundColor: Colors.white,
                      elevation: 0,
                      shape: const RoundedRectangleBorder(),
                    ),
                    onPressed: () {
                      Navigator.pop(
                        context,
                        {
                          "gender": selectedGender,
                          "brand": selectedBrand,
                          "categoryId": selectedCategoryId,
                        },
                      );
                    },
                    child: const Text(
                      "SONUÇLARI GÖR",
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  height: 52,
                  child: OutlinedButton(
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Colors.black54,
                      side: const BorderSide(color: Colors.black26),
                      shape: const RoundedRectangleBorder(),
                    ),
                    onPressed: () {
                      setState(() {
                        selectedGender = null;
                        selectedBrand = null;
                        selectedCategoryId = null;
                      });
                    },
                    child: const Text(
                      "TEMİZLE",
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
