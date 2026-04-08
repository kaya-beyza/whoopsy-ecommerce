import 'package:mobile/features/auth/domain/repositories/auth_repository.dart';

class LoginUseCase {
  final IAuthRepository repository;

  LoginUseCase(this.repository);

  Future<String> execute(String email, String password) {
    return repository.login(email, password);
  }
}
