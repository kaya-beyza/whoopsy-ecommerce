import '../models/category_model.dart';

class CategoryLocalData {
  static List<CategoryModel> getCategories() {
    return [
      CategoryModel(
          id: "1",
          title: "Kadın",
          image:
              "https://i.pinimg.com/1200x/a3/85/c7/a385c770215b033012516e6acdaf287b.jpg"),
      CategoryModel(
          id: "2",
          title: "Erkek",
          image:
              "https://i.pinimg.com/736x/ba/29/1d/ba291d8d3e2efdb7b091d1d94021b88e.jpg"),
      CategoryModel(
          id: "3",
          title: "Çocuk",
          image:
              "https://i.pinimg.com/1200x/f8/25/34/f8253441011c8ddb596b37b895b983d0.jpg"),
    ];
  }
}
