using FluentValidation;

namespace MiniETicaret.Application.Features.Products.Commands.UploadProductImage;

public class UploadProductImageCommandValidator : AbstractValidator<UploadProductImageCommand>
{
    private static readonly string[] AllowedExtensions = { ".jpg", ".jpeg", ".png", ".webp" };

    public UploadProductImageCommandValidator()
    {
        RuleFor(x => x.ProductId)
            .NotEmpty().WithMessage("Ürün ID boş olamaz!");

        RuleFor(x => x.FileStream)
            .NotNull().WithMessage("Dosya boş olamaz!");

        RuleFor(x => x.FileName)
            .NotEmpty().WithMessage("Dosya adı boş olamaz!")
            .Must(HaveAllowedExtension)
            .WithMessage("Sadece .jpg, .jpeg, .png ve .webp dosyaları yüklenebilir!");
    }

    private static bool HaveAllowedExtension(string fileName)
    {
        if (string.IsNullOrEmpty(fileName))
            return false;

        var extension = Path.GetExtension(fileName).ToLowerInvariant();
        return AllowedExtensions.Contains(extension);
    }
}