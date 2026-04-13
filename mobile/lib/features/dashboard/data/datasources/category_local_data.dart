import '../models/category_model.dart';

class CategoryLocalData {
  static List<CategoryModel> getCategories() {
    return [
      CategoryModel(
          id: "1",
          title: "Kadın",
          image:
              "https://res.cloudinary.com/dvesxxy8u/image/upload/v1776063995/lui0rfpmnlckapx5ubta.jpg"),
      CategoryModel(
          id: "2",
          title: "Erkek",
          image:
              "https://res.cloudinary.com/dvesxxy8u/image/upload/v1776064094/lndcrpdacu3h2holssom.jpg"),
      CategoryModel(
          id: "3",
          title: "Çocuk",
          image:
              "https://res.cloudinary.com/dvesxxy8u/image/upload/v1776063937/karrihhuaccxgvf0t8xc.jpg"),
    ];
  }
}
