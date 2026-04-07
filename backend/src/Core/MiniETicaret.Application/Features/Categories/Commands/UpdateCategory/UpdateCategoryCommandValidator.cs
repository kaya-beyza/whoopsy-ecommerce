using FluentValidation;

namespace MiniETicaret.Application.Features.Categories.Commands.UpdateCategory;

public class UpdateCategoryCommandValidator : AbstractValidator<UpdateCategoryCommand>
{
    public UpdateCategoryCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Ürün Id'si boş olamaz!");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Ürün açıklaması boş olamaz!")
            .MaximumLength(500).WithMessage("Ürünün açıklaması 500 karakterden az olmalıdır!");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Ürün ismi boş olamaz.")
            .MaximumLength(100).WithMessage("Ürün ismi 100 karakterden fazla olamaz");    
    }
}