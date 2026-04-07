import 'dart:async';
import 'package:flutter/material.dart';
import 'package:mobile/core/widgets/whoopsy_logo.dart';
import 'package:mobile/features/dashboard/presentation/widgets/brand_section.dart';
import 'package:mobile/features/dashboard/presentation/widgets/category_section.dart';
import 'package:mobile/features/dashboard/presentation/widgets/footer_section.dart';
import 'package:mobile/features/dashboard/presentation/widgets/home_header.dart';
import 'package:mobile/features/dashboard/presentation/widgets/home_slider.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            children: const [
              HomeHeader(),
              SizedBox(height: 20),
              HomeSlider(),
              SizedBox(height: 20),
              CategorySection(),
              SizedBox(height: 20),
              BrandSection(),
              SizedBox(height: 40),
              FooterSection(),
            ],
          ),
        ),
      ),
    );
  }
}
