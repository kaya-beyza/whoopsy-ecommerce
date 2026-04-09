using MediatR;
using MiniETicaret.Application.Features.Categories.Commands.UpdateCategory;
using MiniETicaret.Application.Features.Products.DTOs;
using MiniETicaret.Application.Interfaces;
using MiniETicaret.Domain.Entities;

namespace MiniETicaret.Application.Features.Products.Commands.UpdateCategory;

public class UpdateCategoryCommandHandler : IRequestHandler<UpdateCategoryCommand, bool>
{
    private readonly ICategoryRepository _categoryRepository;

    public UpdateCategoryCommandHandler(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<bool> Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await _categoryRepository.GetByIdAsync(request.Id, cancellationToken);

        if(category == null)
            return false;


        category.Name = request.Name;
        category.Description = request.Description;
        category.IsActive = request.IsActive;
        category.UpdatedDate = DateTime.UtcNow.AddHours(3);


        await _categoryRepository.UpdateAsync(category, cancellationToken);
        return true;
    }
}