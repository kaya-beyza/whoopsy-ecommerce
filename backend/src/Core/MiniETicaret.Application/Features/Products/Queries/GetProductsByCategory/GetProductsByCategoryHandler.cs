using MediatR;
using MiniETicaret.Application.Features.Products.DTOs;
using MiniETicaret.Application.Interfaces;

namespace MiniETicaret.Application.Features.Products.Queries.GetProductsByCategory;

public class GetProductsByCategoryQueryHandler : IRequestHandler<GetProductsByCategoryQuery, List<ProductDto>>
{
    private readonly IProductRepository _producRepository;

    public GetProductsByCategoryQueryHandler(IProductRepository productRepository)
    {
        _producRepository = productRepository;
    }

    public async Task<List<ProductDto>> Handle(GetProductsByCategoryQuery request, CancellationToken cancellationToken)
    {
        var products = await _producRepository.GetByCategoryIdAsync(request.CategoryId, cancellationToken);

        return products.Select(p => new ProductDto
        {
            Id = p.Id,
            Name = p.Name,
            Description = p.Description,
            Price = p.Price,
            StockQuantity = p.StockQuantity,
            CategoryId = p.CategoryId,
            CategoryName = p.Category?.Name ?? "",
            Gender = p.Gender,
            MainImageUrl = p.Images?.FirstOrDefault(i => i.IsMain)?.Url,
            ImageUrls = p.Images?.Select(i => i.Url).ToList() ?? new()
        }).ToList();
    }
}