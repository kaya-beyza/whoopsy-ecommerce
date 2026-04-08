import 'package:flutter/material.dart';
import '../../products/domain/entities/product.dart';

class ProductDetailPage extends StatefulWidget {
  final Product product;

  const ProductDetailPage({
    super.key,
    required this.product,
  });

  @override
  State<ProductDetailPage> createState() => _ProductDetailPageState();
}

class _ProductDetailPageState extends State<ProductDetailPage> {
  final PageController _pageController = PageController();
  int currentPage = 0;

  // Şimdilik mock. Sonra ProductImages tablosundan gelecek.
  late final List<String> productImages;

  // Şimdilik mock. Sonra backend’den gelecek.
  final List<String> sizes = ["XS", "S", "M", "L"];

  @override
  void initState() {
    super.initState();

    productImages = [
      if (widget.product.image != null && widget.product.image!.isNotEmpty)
        widget.product.image!,
      "https://i.pinimg.com/736x/64/1f/70/641f70be1b77ce5f433819372de8cbed.jpg",
      "https://i.pinimg.com/1200x/14/13/43/14134369a1480f7b460a8987482e0d1b.jpg",
    ];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            backgroundColor: Colors.white,
            pinned: true,
            expandedHeight: 520,
            leading: IconButton(
              icon: const Icon(Icons.arrow_back, color: Colors.black),
              onPressed: () => Navigator.pop(context),
            ),
            actions: const [
              Padding(
                padding: EdgeInsets.only(right: 12),
                child: Icon(Icons.ios_share_outlined, color: Colors.black),
              ),
            ],
            flexibleSpace: FlexibleSpaceBar(
              background: Padding(
                padding: const EdgeInsets.only(top: 40), // 🔥 ÜST BOŞLUK
                child: Stack(
                  children: [
                    PageView.builder(
                      controller: _pageController,
                      itemCount: productImages.length,
                      onPageChanged: (index) {
                        setState(() {
                          currentPage = index;
                        });
                      },
                      itemBuilder: (context, index) {
                        return Image.network(
                          productImages[index],
                          width: double.infinity,
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) => Container(
                            color: Colors.grey.shade200,
                            child: const Center(
                              child: Icon(Icons.image_not_supported_outlined),
                            ),
                          ),
                        );
                      },
                    ),
                    Positioned(
                      bottom: 20,
                      left: 0,
                      right: 0,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: List.generate(
                          productImages.length,
                          (index) => Container(
                            margin: const EdgeInsets.symmetric(horizontal: 4),
                            width: currentPage == index ? 18 : 6,
                            height: 6,
                            decoration: BoxDecoration(
                              color: currentPage == index
                                  ? Colors.white
                                  : Colors.white70,
                              borderRadius: BorderRadius.circular(10),
                            ),
                          ),
                        ),
                      ),
                    ),
                    Positioned(
                      bottom: 20,
                      right: 16,
                      child: Container(
                        width: 42,
                        height: 42,
                        decoration: const BoxDecoration(
                          color: Colors.white,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.favorite_border,
                          color: Colors.black,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 18, 16, 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    widget.product.name.toUpperCase(),
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    "${widget.product.price.toStringAsFixed(2)} TL",
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    widget.product.description,
                    style: const TextStyle(
                      fontSize: 15,
                      height: 1.5,
                      color: Colors.black87,
                    ),
                  ),
                  const SizedBox(height: 18),
                  Row(
                    children: [
                      const Text(
                        "Stok: ",
                        style: TextStyle(fontWeight: FontWeight.w700),
                      ),
                      Text("${widget.product.stockQuantity} adet"),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      const Text(
                        "Ürün Kodu: ",
                        style: TextStyle(fontWeight: FontWeight.w700),
                      ),
                      Text(widget.product.id.substring(0, 8)),
                    ],
                  ),
                  const SizedBox(height: 24),

                  if (sizes.isNotEmpty) ...[
                    const Text(
                      "Bedenler",
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Wrap(
                      spacing: 10,
                      runSpacing: 10,
                      children: sizes.map((size) {
                        return Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 18,
                            vertical: 12,
                          ),
                          decoration: BoxDecoration(
                            border: Border.all(color: Colors.black),
                          ),
                          child: Text(size),
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 28),
                  ],

                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () {},
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.black,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 18),
                        shape: const RoundedRectangleBorder(),
                      ),
                      child: const Text(
                        "SEPETE EKLE",
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(height: 32),

                  const Text(
                    "Aynı Kategorideki Ürünler",
                    style: TextStyle(
                      fontSize: 17,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  const SizedBox(height: 14),

                  // Şimdilik placeholder alan. Sonra categoryId ile çekilecek.
                  SizedBox(
                    height: 260,
                    child: ListView.separated(
                      scrollDirection: Axis.horizontal,
                      itemCount: 4,
                      separatorBuilder: (_, __) => const SizedBox(width: 12),
                      itemBuilder: (context, index) {
                        return SizedBox(
                          width: 160,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Expanded(
                                child: Image.network(
                                  "https://picsum.photos/220/320?$index",
                                  fit: BoxFit.cover,
                                  width: double.infinity,
                                ),
                              ),
                              const SizedBox(height: 8),
                              const Text(
                                "Benzer ürün",
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                              const SizedBox(height: 4),
                              const Text(
                                "1.250,00 TL",
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
