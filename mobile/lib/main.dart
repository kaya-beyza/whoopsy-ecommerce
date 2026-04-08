import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:mobile/features/auth/data/datasources/auth_local_data_source.dart';
import 'package:mobile/features/auth/data/datasources/auth_remote_data_source.dart';
import 'package:mobile/features/auth/data/repositories/auth_repository_impl.dart';
import 'package:mobile/features/auth/presentation/state/auth_provider.dart';
import 'package:mobile/features/dashboard/presentation/screens/splash_screen.dart';
import 'package:provider/provider.dart';

final storage = FlutterSecureStorage();

final authLocal = AuthLocalDataSource();
final authRemote = AuthRemoteDataSource();

final authRepository = AuthRepositoryImpl(authRemote, authLocal);

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (_) => AuthProvider(),
      child: MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      debugShowCheckedModeBanner: false,
      home: SplashScreen(),
    );
  }
}
