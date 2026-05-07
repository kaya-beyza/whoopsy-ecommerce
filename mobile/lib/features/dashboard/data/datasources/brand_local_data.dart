import 'package:mobile/features/dashboard/data/models/brand.dart';

class BrandLocalData {
  static List<Brand> getBrands() {
    return [
      Brand(
          id: 1,
          name: "Adidas",
          image:
              "https://res.cloudinary.com/dvesxxy8u/image/upload/v1776063862/zcqzayygvs4ccwpjozlk.jpg"),
      Brand(
          id: 2,
          name: "Converse",
          image:
              "https://res.cloudinary.com/dvesxxy8u/image/upload/q_auto/f_auto/v1776060816/zvxtoqieeelvk3tq72z3.jpg"),
      Brand(
          id: 3,
          name: "New Balance",
          image:
              "https://res.cloudinary.com/dvesxxy8u/image/upload/q_auto/f_auto/v1776060916/lk3zbdkzh9fbvgunfinb.jpg"),
      Brand(
          id: 4,
          name: "Nike",
          image:
              "https://res.cloudinary.com/dvesxxy8u/image/upload/q_auto/f_auto/v1776061011/rfalyvpijw7svi8ux4ee.jpg"),
      Brand(
          id: 5,
          name: "Puma",
          image:
              "https://res.cloudinary.com/dvesxxy8u/image/upload/q_auto/f_auto/v1776063678/s73eauhujgirm3zx8cbv.jpg"),
      Brand(
          id: 6,
          name: "Vans",
          image:
              "https://res.cloudinary.com/dvesxxy8u/image/upload/q_auto/f_auto/v1776061111/a0x0zhauplnx0l5zlkxg.jpg"),
    ];
  }
}
