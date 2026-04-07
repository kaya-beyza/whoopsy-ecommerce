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
            .MinimumLength(6).WithMessage("Şifre en az 6 karakter olmalıdır.")
            .MaximumLength(50).WithMessage("Şifre en fazla 50 karakter olabilir.");
    }
}