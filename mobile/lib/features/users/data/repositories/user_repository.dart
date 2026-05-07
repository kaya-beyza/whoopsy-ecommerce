import 'package:mobile/features/auth/data/datasources/auth_local_data_source.dart';
import '../datasources/user_remote_data_source.dart';
import '../models/user_model.dart';

class UserRepository {
  final UserRemoteDataSource remote;
  final AuthLocalDataSource local;

  UserRepository(this.remote, this.local);

  Future<UserModel> getCurrentUser() async {
    final token = await local.getToken();
    final userId = await local.getUserId();

    if (token == null || userId == null) {
      throw Exception("User not authenticated");
    }

    return await remote.getUser(
      userId: userId,
      token: token,
    );
  }
}
