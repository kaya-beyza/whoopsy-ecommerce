import 'package:flutter/material.dart';
import 'package:mobile/core/widgets/whoopsy_logo.dart';

class HomeHeader extends StatelessWidget {
  const HomeHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          const WhoopsyLogo(size: 20),
          Row(
            children: const [
              Icon(Icons.search),
              SizedBox(width: 12),
              Icon(Icons.favorite_border),
              SizedBox(width: 12),
              Icon(Icons.shopping_bag_outlined),
            ],
          )
        ],
      ),
    );
  }
}
