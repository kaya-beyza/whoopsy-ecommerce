import 'package:mobile/features/auth/data/datasources/auth_remote_data_source.dart';
import 'package:mobile/features/auth/domain/repositories/auth_repository.dart';
import 'package:mobile/features/auth/data/datasources/auth_local_data_source.dart';

class AuthRepositoryImpl implements IAuthRepository {
  final AuthRemoteDataSource remote;
  final AuthLocalDataSource local;

  AuthRepositoryImpl(this.remote, this.local);

  @override
  Future<String> login(String email, String password) async {
    final token = await remote.login(email, password);
    await local.saveToken(token);
    return token;
  }

  @override
  Future<String> register({
    required String fullName,
    required String email,
    required String password,
  }) async {
    final token = await remote.register(fullName, email, password);
    await local.saveToken(token);
    return token;
  }

  @override
  Future<String?> getToken() {
    return local.getToken();
  }

  @override
  Future<void> logout() {
    return local.clear();
  }
}
