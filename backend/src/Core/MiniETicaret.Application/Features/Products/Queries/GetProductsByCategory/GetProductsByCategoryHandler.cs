using MediatR;
using MiniETicaret.Application.Features.Products.DTOs;
using MiniETicaret.Application.Interfaces;
using MiniETicaret.Application.DTOs;

namespace MiniETicaret.Application.Features.Products.Queries.GetProductsByCategory;

public class GetProductsByCategoryQueryHandler : IRequestHandler<GetProductsByCategoryQuery, PagedResultDto<ProductDto>>
{
    private readonly IProductRepository _producRepository;

    public GetProductsByCategoryQueryHandler(IProductRepository productRepository)
    {
        _producRepository = productRepository;
    }

    public async Task<PagedResultDto<ProductDto>> Handle(GetProductsByCategoryQuery request, CancellationToken cancellationToken)
    {
        var (products, totalCount) = await _producRepository.GetByCategoryIdAsync(request.CategoryId, cancellationToken, request.Page, request.PageSize);

        var items = products.Select(p => new ProductDto
        {
            Id = p.Id,
            Name = p.Name,
            Description = p.Description,
            Price = p.Price,
            StockQuantity = p.StockQuantity,
            CategoryId = p.CategoryId,
            CategoryName = p.Category?.Name ?? "",
            Gender = p.Gender,
            Brand = p.Brand,
            MainImageUrl = p.Images?.FirstOrDefault(i => i.IsMain)?.Url,
            ImageUrls = p.Images?.Select(i => i.Url).ToList() ?? new()
        }).ToList();

        return new PagedResultDto<ProductDto>(items, totalCount, request.Page, request.PageSize);
    }
}