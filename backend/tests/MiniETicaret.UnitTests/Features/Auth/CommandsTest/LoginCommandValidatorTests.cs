using MiniETicaret.Application.Features.Auth.Commands.Login;

namespace MiniETicaret.UnitTests.Features.Auth.CommandsTest;

public class LoginCommandValidatorTests
{
    private readonly LoginCommandValidator _validator;

    public LoginCommandValidatorTests()
    {
        _validator = new LoginCommandValidator();
    }
    // ══════════════════════════════════════════
    // TEST 1: Email boş gönderilirse hata döner
    // ══════════════════════════════════════════
    [Fact]
    public void Validate_EmailIsEmpty_ShouldHaveError()
    {
        // ARRANGE — email'i BOŞ bırakıyoruz
        var command = new LoginCommand
        {
            Email = "",
            Password = "sifre123"
        };

        // ACT — validator'ı çalıştır
        var result = _validator.Validate(command);

        // ASSERT — hata olmalı ve doğru mesajı içermeli
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors,
            e => e.PropertyName == "Email"
              && e.ErrorMessage == "Email alanı boş olamaz.");
    }

    // ══════════════════════════════════════════                                                                                                         
    // TEST 2: Email geçersiz formatta ise hata döner                                                                                                     
    // ══════════════════════════════════════════
    [Fact]
    public void Validate_EmailIsInvalid_ShouldHaveError()
    {
        // ARRANGE — email var ama @ işareti yok, geçersiz format
        var command = new LoginCommand
        {
            Email = "bugeçersizmail",
            Password = "sifre123"
        };

        // ACT
        var result = _validator.Validate(command);

        // ASSERT
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors,
            e => e.PropertyName == "Email"
              && e.ErrorMessage == "Geçerli bir email adresi giriniz.");
    }

    // ══════════════════════════════════════════                                                                                                         
    // TEST 3: Şifre boş gönderilirse hata döner
    // ══════════════════════════════════════════
    [Fact]
    public void Validate_PasswordIsEmpty_ShouldHaveError()
    {
        var command = new LoginCommand
        {
            Email = "ahmet@mail.com",
            Password = ""
        };

        // ACT
        var result = _validator.Validate(command);

        // ASSERT
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors,
            e => e.PropertyName == "Password"
              && e.ErrorMessage == "Şifre alanı boş olamaz.");
    }

    // ══════════════════════════════════════════
    // TEST 4: Şifre 6 karakterden kısa ise hata döner
    // ══════════════════════════════════════════
    [Fact]
    public void Validate_PasswordTooShort_ShouldHaveError()
    {
        // ARRANGE — şifre var ama çok kısa (3 karakter)
        var command = new LoginCommand
        {
            Email = "ahmet@mail.com",
            Password = "abc"
        };

        // ACT
        var result = _validator.Validate(command);

        // ASSERT
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors,
            e => e.PropertyName == "Password"
              && e.ErrorMessage == "Şifre en az 6 karakter olmalıdır.");
    }
    // ══════════════════════════════════════════                                                                                                         
    // TEST 5: Tüm alanlar geçerli ise hata olmaz
    // ══════════════════════════════════════════
    [Fact]
    public void Validate_AllFieldsValid_ShouldNotHaveError()
    {
        // ARRANGE — her şey kurallara uygun
        var command = new LoginCommand
        {
            Email = "ahmet@mail.com",
            Password = "sifre123"
        };

        // ACT
        var result = _validator.Validate(command);

        // ASSERT
        Assert.True(result.IsValid);
        Assert.Empty(result.Errors);
    }
}