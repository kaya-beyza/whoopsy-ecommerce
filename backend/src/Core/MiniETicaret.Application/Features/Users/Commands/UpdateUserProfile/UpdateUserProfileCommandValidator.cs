using FluentValidation;

namespace MiniETicaret.Application.Features.Users.Commands.UpdateUserProfile;

public class UpdateUserProfileCommandValidator : AbstractValidator<UpdateUserProfileCommand>
{
    public UpdateUserProfileCommandValidator()
    {
        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("Ad Soyad alanı boş olamaz.")
            .MinimumLength(2).WithMessage("Ad Soyad en az 2 karakter olmalıdır.")
            .MaximumLength(100).WithMessage("Ad Soyad en fazla 100 karakter olabilir.");

        RuleFor(x => x.PhoneNumber)
            .NotEmpty().WithMessage("Telefon numarası boş olamaz.")
            .Matches(@"^(\+90|0)?5\d{9}$")
                .WithMessage("Geçerli bir Türk cep telefonu numarası giriniz (örn: 05551234567).");

        RuleFor(x => x.Address)
            .NotEmpty().WithMessage("Adres alanı boş olamaz.")
            .MaximumLength(500).WithMessage("Adres en fazla 500 karakter olabilir.");

        RuleFor(x => x.BirthDate)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Doğum tarihi boş olamaz.")
            .LessThan(DateTime.UtcNow).WithMessage("Doğum tarihi gelecekte olamaz.")
            .GreaterThan(DateTime.UtcNow.AddYears(-120))
                .WithMessage("Geçerli bir doğum tarihi giriniz.");
    }
}