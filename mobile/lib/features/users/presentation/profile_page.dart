import 'package:flutter/material.dart';
import 'package:mobile/features/auth/data/datasources/auth_local_data_source.dart';
import 'package:mobile/features/users/data/datasources/user_remote_data_source.dart';
import 'package:mobile/features/users/data/repositories/user_repository.dart';

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
      phoneController.text = user.phoneNumber ?? "";
      birthDateController.text = user.birthDate ?? "";
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
          : GestureDetector(
              onTap: () => FocusScope.of(context).unfocus(),
              child: SafeArea(
                child: SingleChildScrollView(
                  keyboardDismissBehavior:
                      ScrollViewKeyboardDismissBehavior.onDrag,
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
                      _buildField("Doğum Tarihi", birthDateController),
                      _buildField("Adres", addressController),
                      _buildGenderField(),
                      _buildField("Telefon", phoneController),
                      const SizedBox(height: 40),
                    ],
                  ),
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

  Widget _buildField(String label, TextEditingController controller) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 18),
      child: TextField(
        controller: controller,
        enabled: isEditing,
        cursorColor: Colors.black,
        style: const TextStyle(
          fontSize: 15,
          color: Colors.black,
        ),
        decoration: InputDecoration(
          labelText: label,
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
        ),
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
            onPressed: () {
              FocusScope.of(context).unfocus();

              // TODO: update user API call burada yapılacak

              setState(() {
                isEditing = false;
              });
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
