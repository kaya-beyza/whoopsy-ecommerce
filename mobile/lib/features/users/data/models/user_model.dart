class UserModel {
  final String id;
  final String fullName;
  final String email;
  final String? address;
  final String? phoneNumber;
  final String? gender;
  final String? birthDate;

  UserModel({
    required this.id,
    required this.fullName,
    required this.email,
    this.address,
    this.phoneNumber,
    this.gender,
    this.birthDate,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json["id"],
      fullName: json["fullName"],
      email: json["email"],
      address: json["address"],
      phoneNumber: json["phoneNumber"],
      gender: json["gender"],
      birthDate: json["birthDate"],
    );
  }
}
