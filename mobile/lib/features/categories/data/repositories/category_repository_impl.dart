import '../../domain/entities/category.dart';
import '../../domain/repositories/category_repository.dart';
import '../datasources/category_remote_data_source.dart';
import '../models/category_model.dart';

class CategoryRepositoryImpl implements ICategoryRepository {
  final CategoryRemoteDataSource remoteDataSource;

  CategoryRepositoryImpl(this.remoteDataSource);

  @override
  Future<List<Category>> getAllCategories() async {
    final List<dynamic> jsonList = await remoteDataSource.getAllCategories();
    return jsonList.map((json) => CategoryModel.fromJson(json)).toList();
  }

  Future<List<Category>> getCategoryTree() async {
    final jsonList = await remoteDataSource.getCategoryTree();

    return jsonList.map((json) {
      return CategoryModel.fromJson(json);
    }).toList();
  }
}
