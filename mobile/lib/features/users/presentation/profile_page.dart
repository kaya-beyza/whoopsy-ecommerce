import 'package:flutter/material.dart';
import 'package:mobile/features/auth/data/datasources/auth_local_data_source.dart';
import 'package:mobile/features/users/data/datasources/user_remote_data_source.dart';
import 'package:mobile/features/users/data/repositories/user_repository.dart';
import 'package:intl/intl.dart';
import 'package:flutter/services.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  bool isEditing = false;
  bool isLoading = true;

  late final UserRepository repository;

  final nameController = TextEditingController();
  final emailController = TextEditingController();
  final birthDateController = TextEditingController();
  final addressController = TextEditingController();
  final phoneController = TextEditingController();

  String gender = "Kadın";

  @override
  void initState() {
    super.initState();

    repository = UserRepository(
      UserRemoteDataSource(),
      AuthLocalDataSource(),
    );

    loadUser();
  }

  Future<void> loadUser() async {
    try {
      final user = await repository.getCurrentUser();

      nameController.text = user.fullName;
      emailController.text = user.email;
      addressController.text = user.address ?? "";
      final phone = user.phoneNumber ?? "";

      if (phone.startsWith("+90")) {
        phoneController.text = phone.substring(3);
      } else if (phone.startsWith("90")) {
        phoneController.text = phone.substring(2);
      } else if (phone.startsWith("0")) {
        phoneController.text = phone.substring(1);
      } else {
        phoneController.text = phone;
      }
      if (user.birthDate != null && user.birthDate!.isNotEmpty) {
        final parsedDate = DateTime.parse(user.birthDate!);

        birthDateController.text = DateFormat('yyyy-MM-dd').format(parsedDate);
      }
      gender = user.gender ?? "Kadın";
    } catch (e) {
      debugPrint("LOAD USER ERROR: $e");
    }

    if (!mounted) return;

    setState(() {
      isLoading = false;
    });
  }

  @override
  void dispose() {
    nameController.dispose();
    emailController.dispose();
    birthDateController.dispose();
    addressController.dispose();
    phoneController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final keyboardBottom = MediaQuery.of(context).viewInsets.bottom;

    return Scaffold(
      resizeToAvoidBottomInset: true,
      appBar: AppBar(
        title: const Text(
          "BİLGİLERİM",
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            letterSpacing: 0.5,
          ),
        ),
        elevation: 0,
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        actions: [
          IconButton(
            icon: Icon(isEditing ? Icons.close : Icons.edit),
            onPressed: () {
              setState(() {
                isEditing = !isEditing;
              });
            },
          ),
        ],
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : SafeArea(
              child: SingleChildScrollView(
                keyboardDismissBehavior:
                    ScrollViewKeyboardDismissBehavior.manual,
                padding: EdgeInsets.only(
                  left: 20,
                  right: 20,
                  top: 12,
                  bottom: isEditing ? 120 : 24,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _sectionTitle("KİŞİSEL BİLGİLER"),
                    const SizedBox(height: 12),
                    _buildField("İsim", nameController),
                    _buildField("Email", emailController),
                    _buildField(
                      "Doğum Tarihi",
                      birthDateController,
                      hintText: "yyyy-mm-dd",
                    ),
                    _buildField("Adres", addressController),
                    _buildGenderField(),
                    _buildField("Telefon", phoneController),
                    const SizedBox(height: 40),
                  ],
                ),
              ),
            ),
      bottomNavigationBar: isEditing
          ? AnimatedPadding(
              duration: const Duration(milliseconds: 200),
              curve: Curves.easeOut,
              padding: EdgeInsets.only(bottom: keyboardBottom),
              child: SafeArea(
                top: false,
                child: Container(
                  color: Colors.white,
                  padding: const EdgeInsets.fromLTRB(20, 12, 20, 12),
                  child: _buildButtons(),
                ),
              ),
            )
          : null,
    );
  }

  Widget _sectionTitle(String title) {
    return Text(
      title,
      style: TextStyle(
        fontSize: 12,
        fontWeight: FontWeight.w600,
        letterSpacing: 1.2,
        color: Colors.grey.shade700,
      ),
    );
  }

  Widget _buildField(
    String label,
    TextEditingController controller, {
    String? hintText,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 18),
      child: TextField(
        controller: controller,
        enabled: isEditing,
        readOnly: label == "Doğum Tarihi",
        onTap: label == "Doğum Tarihi"
            ? () async {
                final pickedDate = await showDatePicker(
                  context: context,
                  initialDate: DateTime(2000),
                  firstDate: DateTime(1900),
                  lastDate: DateTime.now(),
                );

                if (pickedDate != null) {
                  controller.text = DateFormat('yyyy-MM-dd').format(pickedDate);
                }
              }
            : null,
        cursorColor: Colors.black,
        style: const TextStyle(
          fontSize: 15,
          color: Colors.black,
        ),
        decoration: InputDecoration(
          labelText: label,
          hintText: hintText,
          hintStyle: TextStyle(
            color: Colors.grey.shade400,
            fontSize: 13,
          ),
          labelStyle: TextStyle(
            color: Colors.grey.shade600,
            fontSize: 13,
          ),
          floatingLabelStyle: const TextStyle(
            color: Colors.black,
            fontSize: 13,
          ),
          disabledBorder: const UnderlineInputBorder(
            borderSide: BorderSide(color: Colors.black26),
          ),
          enabledBorder: const UnderlineInputBorder(
            borderSide: BorderSide(color: Colors.black38),
          ),
          focusedBorder: const UnderlineInputBorder(
            borderSide: BorderSide(color: Colors.black),
          ),
          prefixText: label == "Telefon" ? "+90 " : null,
        ),
        keyboardType:
            label == "Telefon" ? TextInputType.phone : TextInputType.text,
        inputFormatters: label == "Telefon"
            ? [
                FilteringTextInputFormatter.digitsOnly,
                LengthLimitingTextInputFormatter(10),
              ]
            : [],
      ),
    );
  }

  Widget _buildGenderField() {
    return Padding(
      padding: const EdgeInsets.only(bottom: 18),
      child: InputDecorator(
        decoration: InputDecoration(
          labelText: "Cinsiyet",
          labelStyle: TextStyle(
            color: Colors.grey.shade600,
            fontSize: 13,
          ),
          enabledBorder: const UnderlineInputBorder(
            borderSide: BorderSide(color: Colors.black38),
          ),
          border: const UnderlineInputBorder(),
        ),
        child: isEditing
            ? DropdownButtonHideUnderline(
                child: DropdownButton<String>(
                  value: gender,
                  isExpanded: true,
                  icon: const Icon(Icons.keyboard_arrow_down),
                  items: const ["Kadın", "Erkek"]
                      .map(
                        (g) => DropdownMenuItem(
                          value: g,
                          child: Text(g),
                        ),
                      )
                      .toList(),
                  onChanged: (value) {
                    if (value == null) return;
                    setState(() {
                      gender = value;
                    });
                  },
                ),
              )
            : Text(
                gender,
                style: const TextStyle(fontSize: 15),
              ),
      ),
    );
  }

  Widget _buildButtons() {
    return Row(
      children: [
        Expanded(
          child: OutlinedButton(
            onPressed: () {
              FocusScope.of(context).unfocus();
              setState(() {
                isEditing = false;
              });
              loadUser();
            },
            style: OutlinedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 14),
              side: const BorderSide(color: Colors.black),
              shape: const RoundedRectangleBorder(
                borderRadius: BorderRadius.zero,
              ),
            ),
            child: const Text(
              "İPTAL",
              style: TextStyle(
                color: Colors.black,
                fontSize: 13,
                letterSpacing: 0.8,
              ),
            ),
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: ElevatedButton(
            onPressed: () async {
              FocusScope.of(context).unfocus();

              final fullName = nameController.text.trim();
              final phone = phoneController.text.trim();
              final address = addressController.text.trim();
              final birthDate = birthDateController.text.trim();

              // İsim kontrolü
              if (fullName.isEmpty) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text("Ad soyad boş olamaz"),
                  ),
                );
                return;
              }

              // Telefon kontrolü
              if (phone.isEmpty) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text("Telefon numarası boş olamaz"),
                  ),
                );
                return;
              }

              if (phone.length != 10) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text("Geçerli bir telefon numarası giriniz"),
                  ),
                );
                return;
              }

              // Adres kontrolü
              if (address.isEmpty) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text("Adres boş olamaz"),
                  ),
                );
                return;
              }

              // Doğum tarihi kontrolü
              if (birthDate.isEmpty) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text("Doğum tarihi boş olamaz"),
                  ),
                );
                return;
              }

              try {
                await repository.updateProfile(
                  fullName: fullName,
                  phoneNumber: phone,
                  address: address,
                  birthDate: birthDate,
                );

                if (!mounted) return;

                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text("Profil başarıyla güncellendi"),
                  ),
                );

                setState(() {
                  isEditing = false;
                });

                await loadUser();
              } catch (e) {
                print("UPDATE PROFILE ERROR: $e");

                if (!mounted) return;

                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text("Profil güncellenemedi"),
                  ),
                );
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.black,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 14),
              shape: const RoundedRectangleBorder(
                borderRadius: BorderRadius.zero,
              ),
              elevation: 0,
            ),
            child: const Text(
              "KAYDET",
              style: TextStyle(
                fontSize: 13,
                letterSpacing: 0.8,
              ),
            ),
          ),
        ),
      ],
    );
  }
}
