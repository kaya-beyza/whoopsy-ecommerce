using MiniETicaret.Application.Features.Auth.Commands.Register;

namespace MiniETicaret.UnitTests.Features.Auth.Commands;

public class RegisterCommandValidatorEdgeCaseTests
{
    private readonly RegisterCommandValidator _validator;

    public RegisterCommandValidatorEdgeCaseTests()
    {
        _validator = new RegisterCommandValidator();
    }

    // ══════════════════════════════════════════
    // TEST 1: FullName tam 2 karakter — alt sınır, geçmeli
    // ══════════════════════════════════════════
    [Fact]
    public void Validate_FullNameExactly2Chars_ShouldPass()
    {
        var command = new RegisterCommand
        {
            FullName = "Al",
            Email = "al@mail.com",
            Password = "Sifre123",
            PhoneNumber = "05551234567",
            BirthDate = new DateTime(1990, 1, 1)
        };

        var result = _validator.Validate(command);

        Assert.True(result.IsValid);
    }

    // ══════════════════════════════════════════
    // TEST 2: FullName 1 karakter — alt sınırın altı, hata vermeli
    // ══════════════════════════════════════════
    [Fact]
    public void Validate_FullName1Char_ShouldFail()
    {
        var command = new RegisterCommand
        {
            FullName = "A",
            Email = "a@mail.com",
            Password = "sifre123"
        };

        var result = _validator.Validate(command);

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors,
            e => e.PropertyName == "FullName"
              && e.ErrorMessage == "Ad Soyad en az 2 karakter olmalıdır.");
    }

    // ══════════════════════════════════════════
    // TEST 3: FullName tam 100 karakter — üst sınır, geçmeli
    // ══════════════════════════════════════════
    [Fact]
    public void Validate_FullNameExactly100Chars_ShouldPass()
    {
        var command = new RegisterCommand
        {
            FullName = new string('A', 100),  // tam 100 karakter
            Email = "ahmet@mail.com",
            Password = "Sifre123",
            PhoneNumber = "05551234567",
            BirthDate = new DateTime(1990, 1, 1)
        };

        var result = _validator.Validate(command);

        Assert.True(result.IsValid);
    }

    // ══════════════════════════════════════════
    // TEST 4: Şifre tam 50 karakter — üst sınır, geçmeli
    // ══════════════════════════════════════════
    [Fact]
    public void Validate_PasswordExactly50Chars_ShouldPass()
    {
        var command = new RegisterCommand
        {
            FullName = "Ahmet Yılmaz",
            Email = "ahmet@mail.com",
            Password = "A" + new string('a', 48) + "1",  // tam 50 karakter (1 büyük + 48 küçük + 1 rakam)
            PhoneNumber = "05551234567",
            BirthDate = new DateTime(1990, 1, 1)
        };

        var result = _validator.Validate(command);

        Assert.True(result.IsValid);
    }

    // ══════════════════════════════════════════
    // TEST 5: Şifre tam 8 karakter — alt sınır, geçmeli
    // ══════════════════════════════════════════
    [Fact]
    public void Validate_PasswordExactly8Chars_ShouldPass()
    {
        var command = new RegisterCommand
        {
            FullName = "Ahmet Yılmaz",
            Email = "ahmet@mail.com",
            Password = "Abcdef12",  // tam 8 karakter (1 büyük + 5 küçük + 2 rakam)
            PhoneNumber = "05551234567",
            BirthDate = new DateTime(1990, 1, 1)
        };

        var result = _validator.Validate(command);

        Assert.True(result.IsValid);
    }

    // ══════════════════════════════════════════
    // TEST 6: Tüm alanlar boş — birden fazla hata
    // ══════════════════════════════════════════
    [Fact]
    public void Validate_AllFieldsEmpty_ShouldHaveMultipleErrors()
    {
        var command = new RegisterCommand
        {
            FullName = "",
            Email = "",
            Password = ""
        };

        var result = _validator.Validate(command);

        Assert.False(result.IsValid);
        Assert.True(result.Errors.Count >= 3);
        Assert.Contains(result.Errors, e => e.PropertyName == "FullName");
        Assert.Contains(result.Errors, e => e.PropertyName == "Email");
        Assert.Contains(result.Errors, e => e.PropertyName == "Password");
    }

    // ══════════════════════════════════════════
    // TEST 7: FullName sadece boşluk — boş gibi davranmalı
    // ══════════════════════════════════════════
    [Fact]
    public void Validate_FullNameIsWhitespace_ShouldFail()
    {
        var command = new RegisterCommand
        {
            FullName = "   ",
            Email = "ahmet@mail.com",
            Password = "sifre123"
        };

        var result = _validator.Validate(command);

        Assert.False(result.IsValid);
    }
}