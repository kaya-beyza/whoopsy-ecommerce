using FluentValidation;

namespace MiniETicaret.Application.Features.Categories.Commands.CreateCategory;

public class CreateCategoryCommandValidator : AbstractValidator<CreateCategoryCommand>
{
    public CreateCategoryCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Kategori adı boş olamaz")
            .MaximumLength(100).WithMessage("Kategori adı 100 karakterden uzun olamaz");

        RuleFor(x => x.Description)
            .MaximumLength(500).WithMessage("Kategori açıklaması 500 karakterden uzun olamaz");    
    }
}