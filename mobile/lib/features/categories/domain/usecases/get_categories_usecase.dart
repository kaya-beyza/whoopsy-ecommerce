import '../repositories/category_repository.dart';
import '../entities/category.dart';

class GetCategoriesUseCase {
  final ICategoryRepository repository;

  GetCategoriesUseCase(this.repository);

  Future<List<Category>> execute() async {
    return await repository.getAllCategories();
  }
}
