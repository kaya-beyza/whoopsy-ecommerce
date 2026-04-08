abstract class IAuthRepository {
  /// Kullanıcı giriş yapar ve token döner
  Future<String> login(String email, String password);

  /// Yeni kullanıcı oluşturur ve token döner
  Future<String> register({
    required String fullName,
    required String email,
    required String password,
  });

  /// Local'den mevcut kullanıcı token'ını getirir
  Future<String?> getToken();

  /// Kullanıcıyı logout yapar (token silinir)
  Future<void> logout();
}
