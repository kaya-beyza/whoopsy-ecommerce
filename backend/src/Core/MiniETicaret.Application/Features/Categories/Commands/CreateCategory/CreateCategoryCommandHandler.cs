using MediatR;
using MiniETicaret.Domain.Entities;
using MiniETicaret.Application.Interfaces;

namespace MiniETicaret.Application.Features.Categories.Commands.CreateCategory;

public class CreateCategoryCommandHandler : IRequestHandler<CreateCategoryCommand, Guid>
{
    private readonly ICategoryRepository _categoryRepository;

    public CreateCategoryCommandHandler(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<Guid> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = new Category
        {
            Name= request.Name,
            Description = request.Description,
            IsActive = true,
            CreatedDate = DateTime.UtcNow.AddHours(3)

        };

        await _categoryRepository.AddAsync(category, cancellationToken);
        return category.Id;
    }
}    
