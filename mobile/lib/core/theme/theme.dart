import 'package:flutter/material.dart';

ThemeData lightMode = ThemeData(
  brightness: Brightness.light,
  scaffoldBackgroundColor: const Color(0xFFF2F5F7),
  colorScheme: const ColorScheme.light(
    primary: Color.fromARGB(255, 30, 71, 74),
    secondary: Color.fromARGB(255, 214, 242, 244),
    onSecondary: Color.fromARGB(255, 153, 172, 173),
    tertiary: Color.fromARGB(255, 110, 149, 144),
    surface: Colors.white,
    background: Color(0xFFF2F5F7),
    error: Color(0xFFE35D6A),
  ),
  appBarTheme: const AppBarTheme(
    backgroundColor: Color.fromARGB(255, 33, 80, 84),
    foregroundColor: Colors.white,
    elevation: 0,
  ),
  cardTheme: CardTheme(
    color: Colors.white,
    elevation: 2,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(18),
    ),
  ),
);

ThemeData darkMode = ThemeData(
  brightness: Brightness.dark,
  scaffoldBackgroundColor: const Color(0xFF14181C),
  colorScheme: const ColorScheme.dark(
    primary: Color(0xFF3FA9A2),
    secondary: Color.fromARGB(255, 51, 62, 73),
    onSecondary: Color.fromARGB(255, 90, 106, 120),
    tertiary: Color(0xFF67D6C4),
    surface: Color(0xFF1E252B),
    background: Color(0xFF14181C),
    error: Color(0xFFFF6B6B),
  ),
  appBarTheme: const AppBarTheme(
    backgroundColor: Color(0xFF1E252B),
    foregroundColor: Colors.white,
    elevation: 0,
  ),
  cardTheme: CardTheme(
    color: Color(0xFF1E252B),
    elevation: 4,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(18),
    ),
  ),
);
