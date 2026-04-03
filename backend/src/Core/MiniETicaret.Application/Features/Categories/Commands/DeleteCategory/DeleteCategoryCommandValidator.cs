using FluentValidation;

namespace MiniETicaret.Application.Features.Categories.Commands.DeleteCategory;

public class DeleteCategoryCommandValidator : AbstractValidator<DeleteCategoryCommand>
{
    public DeleteCategoryCommandValidator()
    {
        RuleFor(x => x.Id).NotEmpty()
            .WithMessage("Kategori Id'si boş olamaz.");
    }
}