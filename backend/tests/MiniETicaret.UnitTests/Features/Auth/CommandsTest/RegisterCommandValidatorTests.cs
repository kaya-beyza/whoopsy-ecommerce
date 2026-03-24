using MiniETicaret.Application.Features.Auth.Commands.Register;

namespace MiniETicaret.UnitTests.Features.Auth.Commands;

public class RegisterCommandValidatorTests
{
    private readonly RegisterCommandValidator _validator;

    public RegisterCommandValidatorTests()
    {
        _validator = new RegisterCommandValidator();
    }

    // ══════════════════════════════════════════
    // TEST 1: FullName boş ise hata döner
    // ══════════════════════════════════════════
    [Fact]
    public void Validate_FullNameIsEmpty_ShouldHaveError()
    {
        var command = new RegisterCommand
        {
            FullName = "",
            Email = "ahmet@mail.com",
            Password = "sifre123"
        };

        var result = _validator.Validate(command);

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors,
            e => e.PropertyName == "FullName"
              && e.ErrorMessage == "Ad Soyad alanı boş olamaz.");
    }

    // ══════════════════════════════════════════
    // TEST 2: FullName 2 karakterden kısa ise hata döner
    // ══════════════════════════════════════════
    [Fact]
    public void Validate_FullNameTooShort_ShouldHaveError()
    {
        var command = new RegisterCommand
        {
            FullName = "A",
            Email = "ahmet@mail.com",
            Password = "sifre123"
        };

        var result = _validator.Validate(command);

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors,
            e => e.PropertyName == "FullName"
              && e.ErrorMessage == "Ad Soyad en az 2 karakter olmalıdır.");
    }

    // ══════════════════════════════════════════
    // TEST 3: FullName 100 karakterden uzun ise hata döner
    // ══════════════════════════════════════════
    [Fact]
    public void Validate_FullNameTooLong_ShouldHaveError()
    {
        var command = new RegisterCommand
        {
            FullName = new string('A', 101),
            Email = "ahmet@mail.com",
            Password = "sifre123"
        };

        var result = _validator.Validate(command);

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors,
            e => e.PropertyName == "FullName"
              && e.ErrorMessage == "Ad Soyad en fazla 100 karakter olabilir.");
    }

    // ══════════════════════════════════════════
    // TEST 4: Email boş ise hata döner
    // ══════════════════════════════════════════
    [Fact]
    public void Validate_EmailIsEmpty_ShouldHaveError()
    {
        var command = new RegisterCommand
        {
            FullName = "Ahmet Yılmaz",
            Email = "",
            Password = "sifre123"
        };

        var result = _validator.Validate(command);

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors,
            e => e.PropertyName == "Email"
              && e.ErrorMessage == "Email alanı boş olamaz.");
    }

    // ══════════════════════════════════════════
    // TEST 5: Email geçersiz formatta ise hata döner
    // ══════════════════════════════════════════
    [Fact]
    public void Validate_EmailIsInvalid_ShouldHaveError()
    {
        var command = new RegisterCommand
        {
            FullName = "Ahmet Yılmaz",
            Email = "bugeçersizmail",
            Password = "sifre123"
        };

        var result = _validator.Validate(command);

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors,
            e => e.PropertyName == "Email"
              && e.ErrorMessage == "Geçerli bir email adresi giriniz.");
    }

    // ══════════════════════════════════════════
    // TEST 6: Şifre boş ise hata döner
    // ══════════════════════════════════════════
    [Fact]
    public void Validate_PasswordIsEmpty_ShouldHaveError()
    {
        var command = new RegisterCommand
        {
            FullName = "Ahmet Yılmaz",
            Email = "ahmet@mail.com",
            Password = ""
        };

        var result = _validator.Validate(command);

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors,
            e => e.PropertyName == "Password"
              && e.ErrorMessage == "Şifre alanı boş olamaz.");
    }

    // ══════════════════════════════════════════
    // TEST 7: Şifre 6 karakterden kısa ise hata döner
    // ══════════════════════════════════════════
    [Fact]
    public void Validate_PasswordTooShort_ShouldHaveError()
    {
        var command = new RegisterCommand
        {
            FullName = "Ahmet Yılmaz",
            Email = "ahmet@mail.com",
            Password = "abc"
        };

        var result = _validator.Validate(command);

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors,
            e => e.PropertyName == "Password"
              && e.ErrorMessage == "Şifre en az 6 karakter olmalıdır.");
    }

    // ══════════════════════════════════════════
    // TEST 8: Şifre 50 karakterden uzun ise hata döner
    // ══════════════════════════════════════════
    [Fact]
    public void Validate_PasswordTooLong_ShouldHaveError()
    {
        var command = new RegisterCommand
        {
            FullName = "Ahmet Yılmaz",
            Email = "ahmet@mail.com",
            Password = new string('x', 51)
        };

        var result = _validator.Validate(command);

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors,
            e => e.PropertyName == "Password"
              && e.ErrorMessage == "Şifre en fazla 50 karakter olabilir.");
    }

    // ══════════════════════════════════════════
    // TEST 9: Tüm alanlar geçerli ise hata olmaz
    // ══════════════════════════════════════════
    [Fact]
    public void Validate_AllFieldsValid_ShouldNotHaveError()
    {
        var command = new RegisterCommand
        {
            FullName = "Ahmet Yılmaz",
            Email = "ahmet@mail.com",
            Password = "sifre123"
        };

        var result = _validator.Validate(command);

        Assert.True(result.IsValid);
        Assert.Empty(result.Errors);
    }
}