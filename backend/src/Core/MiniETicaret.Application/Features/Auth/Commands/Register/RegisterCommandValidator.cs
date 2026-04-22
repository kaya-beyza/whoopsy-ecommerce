using FluentValidation;
namespace MiniETicaret.Application.Features.Auth.Commands.Register;

public class RegisterCommandValidator : AbstractValidator<RegisterCommand>
{
    public RegisterCommandValidator()
    {
        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("Ad Soyad alanı boş olamaz.").MinimumLength(2).WithMessage("Ad Soyad en az 2 karakter olmalıdır.")
            .MaximumLength(100).WithMessage("Ad Soyad en fazla 100 karakter olabilir.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email alanı boş olamaz.")
            .EmailAddress().WithMessage("Geçerli bir email adresi giriniz.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Şifre alanı boş olamaz.")
            .MinimumLength(8).WithMessage("Şifre en az 8 karakter olmalıdır.")
            .MaximumLength(50).WithMessage("Şifre en fazla 50 karakter olabilir.")
            .Matches("[A-Z]").WithMessage("Şifre en az bir büyük harf içermelidir.")
            .Matches("[a-z]").WithMessage("Şifre en az bir küçük harf içermelidir.")
            .Matches("[0-9]").WithMessage("Şifre en az bir rakam içermelidir.");

        RuleFor(x => x.PhoneNumber)
             .NotEmpty().WithMessage("Telefon numarası boş olamaz.")
             .Matches(@"^(\+90|0)?5\d{9}$")
                 .WithMessage("Geçerli bir Türk cep telefonu numarası giriniz (örn: 05551234567).");

        RuleFor(x => x.BirthDate)
     .Cascade(CascadeMode.Stop)
     .NotNull().WithMessage("Doğum tarihi boş olamaz.")
     .LessThan(DateTime.UtcNow).WithMessage("Doğum tarihi gelecekte olamaz.")
     .GreaterThan(DateTime.UtcNow.AddYears(-120))
         .WithMessage("Geçerli bir doğum tarihi giriniz.");

    }
}