using MediatR;
using MiniETicaret.Application.Features.Categories.DTOs;
using MiniETicaret.Application.Interfaces;

namespace MiniETicaret.Application.Features.Categories.Queries.GetCategoryTree;

public class GetCategoryTreeQueryHandler : IRequestHandler<GetCategoryTreeQuery, List<CategoryDto>>
{
    private readonly ICategoryRepository _categoryRepository;

    public GetCategoryTreeQueryHandler(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<List<CategoryDto>> Handle(GetCategoryTreeQuery request, CancellationToken cancellationToken)
    {
        var categories = await _categoryRepository.GetCategoryTreeAsync(cancellationToken);

        return categories.Select(c => new CategoryDto
        {
            Id = c.Id,
            Name = c.Name,
            Description = c.Description,
            ParentId = null,
            ParentName = null,
            ProductCount = 0, // Simplified to avoid performance issues
            SubCategories = c.SubCategories.Select(sub => new CategoryDto
            {
                Id = sub.Id,
                Name = sub.Name,
                Description = sub.Description,
                ParentId = c.Id,
                ParentName = c.Name,
                ProductCount = 0,
                SubCategories = new()
            }).ToList()
        }).ToList();
    }
}