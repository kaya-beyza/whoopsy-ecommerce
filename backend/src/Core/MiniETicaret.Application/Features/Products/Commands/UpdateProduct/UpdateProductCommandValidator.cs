using FluentValidation;

namespace MiniETicaret.Application.Features.Products.Commands.UpdateProduct;

public class UpdateProductCommandValidator : AbstractValidator<UpdateProductCommand>
{
    public UpdateProductCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Ürün Id boş olamaz!");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Ürünün adı boş olamaz")
            .MaximumLength(100).WithMessage("Ürünün adı 100 karakterden fazla olamaz!");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Ürün açıklaması boş olamaz")
            .MaximumLength(500).WithMessage("Ürün açıklaması 500 karakterden uzun olamaz!");

        RuleFor(x => x.Price)
            .GreaterThan(0).WithMessage("Ürün fiyatı sıfırdan büyük olmalıdır!"); 

        RuleFor(x => x.StockQuantity)
            .GreaterThanOrEqualTo(0).WithMessage("Stok miktarı sıfırdan küçük olamaz!");

        RuleFor(x => x.CategoryId)
            .NotEmpty().WithMessage("Kategori seçilmek zorunadır!");   



    }
}