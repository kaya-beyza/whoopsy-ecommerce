using FluentValidation;

namespace MiniETicaret.Application.Features.Products.Commands.CreateProduct;

public class CreateProductCommandValidator : AbstractValidator<CreateProductCommand>
{
    public CreateProductCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Ürünün adı boş olamaz!")
            .MaximumLength(100).WithMessage("Ürünün adı 100 karakterden uzun olamaz!");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Ürün açıklaması boş olamaz!")
            .MaximumLength(500).WithMessage("Ürün açıklaması 500 karakterden uzun olamaz!");

        RuleFor(x => x.Price)
            .GreaterThan(0).WithMessage("Ürün fiyatı sıfırdan büyük olmalıdır!");   

        RuleFor(x => x.StockQuantity)
            .GreaterThanOrEqualTo(0).WithMessage("Stok miktari sıfırdan küçük olamaz!");

        RuleFor(x => x.CategoryId)
            .NotEmpty().WithMessage("Kategori Id boş olamaz!");

        RuleFor(x => x.Gender)
            .IsInEnum().WithMessage("Lütfen geçerli bir cinsiyet seçin!");

        RuleFor(x => x.Brand)
            .IsInEnum().WithMessage("Lütfen geçerli bir marka seçiniz!");    

           
    }
}