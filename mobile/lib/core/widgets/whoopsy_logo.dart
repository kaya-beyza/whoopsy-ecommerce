import 'package:flutter/material.dart';

class WhoopsyLogo extends StatefulWidget {
  final double size;

  const WhoopsyLogo({super.key, this.size = 24});

  @override
  State<WhoopsyLogo> createState() => _WhoopsyLogoState();
}

class _WhoopsyLogoState extends State<WhoopsyLogo>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();

    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 1),
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Widget shinyOops(double size) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return ShaderMask(
          shaderCallback: (bounds) {
            return LinearGradient(
              begin: Alignment(-3 + _controller.value * 2, 0),
              end: Alignment(1 + _controller.value * 2, 0),
              colors: const [
                Color.fromARGB(255, 255, 48, 86),
                Colors.white,
                Color.fromARGB(255, 210, 38, 70),
              ],
              stops: const [0.2, 0.5, 0.8],
            ).createShader(bounds);
          },
          child: Text(
            "oops",
            style: TextStyle(
              fontSize: size,
              fontWeight: FontWeight.w900,
              color: Colors.white,
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final size = widget.size;

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(
          "wh",
          style: TextStyle(
            fontSize: size,
            fontWeight: FontWeight.w700,
            color: Colors.black,
          ),
        ),
        shinyOops(size),
        Text(
          "y",
          style: TextStyle(
            fontSize: size,
            fontWeight: FontWeight.w700,
            color: Colors.black,
          ),
        ),
      ],
    );
  }
}
