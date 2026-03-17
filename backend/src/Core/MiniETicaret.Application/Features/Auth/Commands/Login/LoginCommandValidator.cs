using FluentValidation;
namespace MiniETicaret.Application.Features.Auth.Commands.Login;

public class LoginCommandValidator : AbstractValidator<LoginCommand>
{
    public LoginCommandValidator()
    {
        RuleFor(x => x.Email)
        .NotEmpty().WithMessage("Email alanı boş olamaz.")
        .EmailAddress().WithMessage("Geçerli bir email adresi giriniz.");

        RuleFor(x => x.Password)
              .NotEmpty().WithMessage("Şifre alanı boş olamaz.")
              .MinimumLength(6).WithMessage("Şifre en az 6 karakter olmalıdır.");
    }
}