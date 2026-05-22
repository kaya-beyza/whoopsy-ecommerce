import 'package:flutter/material.dart';
import 'package:mobile/features/auth/data/datasources/auth_local_data_source.dart';
import 'package:mobile/features/dashboard/data/datasources/cart_remote_data_source.dart';
import 'package:mobile/features/dashboard/data/datasources/order_remote_data_source.dart';
import 'package:mobile/features/dashboard/data/repositories/order_repository.dart';
import 'package:flutter/services.dart';

class CheckoutPage extends StatefulWidget {
  final String orderId;
  final double totalPrice;

  const CheckoutPage({
    super.key,
    required this.orderId,
    required this.totalPrice,
  });

  @override
  State<CheckoutPage> createState() => _CheckoutPageState();
}

class _CheckoutPageState extends State<CheckoutPage> {
  final _formKey = GlobalKey<FormState>();

  final _nameController = TextEditingController();
  final _surnameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _addressController = TextEditingController();
  final _cityController = TextEditingController();

  int _selectedCardIndex = 0;

  bool _isLoading = false;

  final _repo = OrderRepository(OrderRemoteDataSource());

  final List<Map<String, String>> fakeCards = [
    {
      "holder": "AHMET EREN",
      "number": "**** **** **** 1111",
      "month": "12",
      "year": "28",
      "cvc": "123",
      "fullNumber": "5528790000000008",
    },
    {
      "holder": "TEST USER",
      "number": "**** **** **** 2222",
      "month": "11",
      "year": "27",
      "cvc": "456",
      "fullNumber": "5528790000000008",
    },
    {
      "holder": "SANDBOX USER",
      "number": "**** **** **** 3333",
      "month": "10",
      "year": "29",
      "cvc": "789",
      "fullNumber": "5528790000000008",
    },
  ];

  Future<void> _completePayment() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
    });

    try {
      final selectedCard = fakeCards[_selectedCardIndex];

      await _repo.createPayment(
        orderId: widget.orderId,
        cardHolderName: selectedCard["holder"]!,
        cardNumber: selectedCard["fullNumber"]!,
        expireMonth: selectedCard["month"]!,
        expireYear: selectedCard["year"]!,
        cvc: selectedCard["cvc"]!,
        buyerName: _nameController.text.trim(),
        buyerSurname: _surnameController.text.trim(),
        buyerEmail: _emailController.text.trim(),
        buyerPhone: "+90${_phoneController.text.trim()}",
        buyerAddress: _addressController.text.trim(),
        buyerCity: _cityController.text.trim(),
      );

      try {
        final cartRemote = CartRemoteDataSource();
        final local = AuthLocalDataSource();

        final userId = await local.getUserId();

        if (userId != null) {
          final cartItems = await cartRemote.getUserCart(userId);

          for (final item in cartItems) {
            await cartRemote.removeItem(
              userId,
              item["productId"],
            );
          }
        }
      } catch (e) {
        print("CART CLEAN ERROR: $e");
      }

      if (!mounted) return;

      showDialog(
        context: context,
        builder: (_) => AlertDialog(
          title: const Text("Ödeme Başarılı"),
          content: const Text(
            "Siparişiniz başarıyla oluşturuldu.",
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(context);
                Navigator.pop(context, true);
              },
              child: const Text("Tamam"),
            )
          ],
        ),
      );
    } catch (e) {
      print(e);

      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Ödeme başarısız"),
        ),
      );
    }

    if (mounted) {
      setState(() {
        _isLoading = false;
      });
    }
  }

  InputDecoration _inputDecoration(String label) {
    return InputDecoration(
      labelText: label,
      labelStyle: const TextStyle(fontSize: 14),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(2),
        borderSide: BorderSide(color: Colors.grey.shade300),
      ),
      focusedBorder: const OutlineInputBorder(
        borderRadius: BorderRadius.all(Radius.circular(2)),
        borderSide: BorderSide(color: Colors.black),
      ),
      errorBorder: const OutlineInputBorder(
        borderRadius: BorderRadius.all(Radius.circular(2)),
        borderSide: BorderSide(color: Colors.red),
      ),
      focusedErrorBorder: const OutlineInputBorder(
        borderRadius: BorderRadius.all(Radius.circular(2)),
        borderSide: BorderSide(color: Colors.red),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text("ÖDEME"),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          border: Border(
            top: BorderSide(
              color: Colors.grey.shade200,
            ),
          ),
        ),
        child: SafeArea(
          child: SizedBox(
            height: 52,
            child: ElevatedButton(
              onPressed: _isLoading ? null : _completePayment,
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.black,
                foregroundColor: Colors.white,
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              child: _isLoading
                  ? const SizedBox(
                      width: 22,
                      height: 22,
                      child: CircularProgressIndicator(
                        color: Colors.white,
                        strokeWidth: 2,
                      ),
                    )
                  : Text(
                      "ÖDEMEYİ TAMAMLA • ${widget.totalPrice.toStringAsFixed(2)} TL",
                      style: const TextStyle(
                        letterSpacing: 1,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
            ),
          ),
        ),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            const Text(
              "TESLİMAT BİLGİLERİ",
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 13,
                letterSpacing: 1,
              ),
            ),
            const SizedBox(height: 20),
            TextFormField(
              controller: _nameController,
              decoration: _inputDecoration("Ad"),
              validator: (v) {
                if (v == null || v.trim().isEmpty) {
                  return "Ad boş olamaz";
                }
                return null;
              },
            ),
            const SizedBox(height: 14),
            TextFormField(
              controller: _surnameController,
              decoration: _inputDecoration("Soyad"),
              validator: (v) {
                if (v == null || v.trim().isEmpty) {
                  return "Soyad boş olamaz";
                }
                return null;
              },
            ),
            const SizedBox(height: 14),
            TextFormField(
              controller: _emailController,
              decoration: _inputDecoration("Email"),
              validator: (v) {
                if (v == null || v.trim().isEmpty) {
                  return "Email boş olamaz";
                }

                final emailRegex = RegExp(
                  r'^[^@]+@[^@]+\.[^@]+',
                );

                if (!emailRegex.hasMatch(v.trim())) {
                  return "Geçerli bir email giriniz";
                }

                return null;
              },
            ),
            const SizedBox(height: 14),
            TextFormField(
              controller: _phoneController,
              decoration: _inputDecoration("Telefon").copyWith(
                prefixText: "+90 ",
              ),
              keyboardType: TextInputType.phone,
              inputFormatters: [
                FilteringTextInputFormatter.digitsOnly,
                LengthLimitingTextInputFormatter(10),
              ],
              validator: (v) {
                if (v == null || v.trim().isEmpty) {
                  return "Telefon boş olamaz";
                }

                if (v.trim().length != 10) {
                  return "Geçerli telefon giriniz";
                }

                return null;
              },
            ),
            const SizedBox(height: 14),
            TextFormField(
              controller: _cityController,
              decoration: _inputDecoration("Şehir"),
              validator: (v) {
                if (v == null || v.trim().isEmpty) {
                  return "Şehir boş olamaz";
                }
                return null;
              },
            ),
            const SizedBox(height: 14),
            TextFormField(
              controller: _addressController,
              maxLines: 3,
              decoration: _inputDecoration("Adres"),
              validator: (v) {
                if (v == null || v.trim().isEmpty) {
                  return "Adres boş olamaz";
                }
                return null;
              },
            ),
            const SizedBox(height: 34),
            const Text(
              "KARTLARIM",
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 13,
                letterSpacing: 1,
              ),
            ),
            const SizedBox(height: 18),
            ...List.generate(fakeCards.length, (index) {
              final card = fakeCards[index];

              final selected = _selectedCardIndex == index;

              return GestureDetector(
                onTap: () {
                  setState(() {
                    _selectedCardIndex = index;
                  });
                },
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 180),
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: selected ? Colors.black : Colors.white,
                    border: Border.all(
                      color: selected ? Colors.black : Colors.grey.shade300,
                    ),
                    borderRadius: BorderRadius.circular(2),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        Icons.credit_card,
                        color: selected ? Colors.white : Colors.black,
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              card["holder"]!,
                              style: TextStyle(
                                color: selected ? Colors.white : Colors.black,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              card["number"]!,
                              style: TextStyle(
                                color:
                                    selected ? Colors.white70 : Colors.black54,
                              ),
                            ),
                          ],
                        ),
                      ),
                      AnimatedContainer(
                        duration: const Duration(milliseconds: 180),
                        width: 18,
                        height: 18,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: selected ? Colors.white : Colors.black,
                            width: 2,
                          ),
                        ),
                        child: selected
                            ? Center(
                                child: Container(
                                  width: 8,
                                  height: 8,
                                  decoration: const BoxDecoration(
                                    shape: BoxShape.circle,
                                    color: Colors.white,
                                  ),
                                ),
                              )
                            : null,
                      )
                    ],
                  ),
                ),
              );
            }),
          ],
        ),
      ),
    );
  }
}
