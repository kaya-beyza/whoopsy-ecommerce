using MiniETicaret.Application.Features.Auth.Commands.Login;

namespace MiniETicaret.UnitTests.Features.Auth.Commands;

public class LoginCommandValidatorEdgeCaseTests
{
    private readonly LoginCommandValidator _validator;

    public LoginCommandValidatorEdgeCaseTests()
    {
        _validator = new LoginCommandValidator();
    }

    // ══════════════════════════════════════════
    // TEST 1: Şifre tam 6 karakter — sınır değer, geçmeli
    // ══════════════════════════════════════════
    [Fact]
    public void Validate_PasswordExactly6Chars_ShouldPass()
    {
        var command = new LoginCommand
        {
            Email = "ahmet@mail.com",
            Password = "abc123"  // tam 6 karakter
        };

        var result = _validator.Validate(command);

        Assert.True(result.IsValid);
    }

    // ══════════════════════════════════════════
    // TEST 2: Şifre 5 karakter — sınırın 1 altı, hata vermeli
    // ══════════════════════════════════════════
    [Fact]
    public void Validate_Password5Chars_ShouldFail()
    {
        var command = new LoginCommand
        {
            Email = "ahmet@mail.com",
            Password = "abc12"  // 5 karakter — 1 eksik!
        };

        var result = _validator.Validate(command);

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors,
            e => e.PropertyName == "Password"
              && e.ErrorMessage == "Şifre en az 6 karakter olmalıdır.");
    }

    // ══════════════════════════════════════════
    // TEST 3: Email sadece boşluklardan oluşuyor
    // ══════════════════════════════════════════
    [Fact]
    public void Validate_EmailIsWhitespace_ShouldFail()
    {
        var command = new LoginCommand
        {
            Email = "   ",      // sadece boşluk
            Password = "sifre123"
        };

        var result = _validator.Validate(command);

        Assert.False(result.IsValid);
    }

    // ══════════════════════════════════════════
    // TEST 4: Email ve şifre ikisi de boş — birden fazla hata
    // ══════════════════════════════════════════
    [Fact]
    public void Validate_BothFieldsEmpty_ShouldHaveMultipleErrors()
    {
        var command = new LoginCommand
        {
            Email = "",
            Password = ""
        };

        var result = _validator.Validate(command);

        Assert.False(result.IsValid);

        // En az 2 hata olmalı (email + password)
        Assert.True(result.Errors.Count >= 2);

        // Email hatası var mı?
        Assert.Contains(result.Errors, e => e.PropertyName == "Email");

        // Password hatası var mı?
        Assert.Contains(result.Errors, e => e.PropertyName == "Password");
    }
}