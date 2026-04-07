import 'package:mobile/features/dashboard/data/models/brand.dart';

class BrandLocalData {
  static List<Brand> getBrands() {
    return [
      Brand(
          id: "1",
          name: "New Balance",
          image:
              "https://i.pinimg.com/1200x/af/2d/68/af2d68ef53e8e44689e22baba0bef3da.jpg"),
      Brand(
          id: "2",
          name: "Adidas",
          image:
              "https://i.pinimg.com/736x/67/a2/c9/67a2c9cacc56a7c91db3962168cbea21.jpg"),
      Brand(
          id: "3",
          name: "Puma",
          image:
              "https://i.pinimg.com/736x/ae/bc/da/aebcda47e5ffb3d6a4982499d6da8871.jpg"),
      Brand(
          id: "4",
          name: "Vans",
          image:
              "https://i.pinimg.com/1200x/9e/27/3e/9e273e13bfba4e0c2984afffbd3c3665.jpg"),
    ];
  }
}
