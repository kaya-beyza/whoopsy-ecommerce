using MediatR;
using MiniETicaret.Application.Features.Products.DTOs;
using MiniETicaret.Application.Interfaces;

namespace MiniETicaret.Application.Features.Products.Queries.GetProductsByBrand;

public class GetProductsByBrandHandler : IRequestHandler<GetProductsByBrandQuery, List<ProductDto>>
{
    private readonly IProductRepository _productRepository;

    public GetProductsByBrandHandler(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<List<ProductDto>> Handle(GetProductsByBrandQuery request, CancellationToken cancellationToken)
    {
        var products = await _productRepository.GetByBrandAsync(request.Brand, cancellationToken);

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
            Brand = p.Brand,
            MainImageUrl = p.Images?.FirstOrDefault(i => i.IsMain)?.Url,
            ImageUrls = p.Images?.Select(i => i.Url).ToList() ?? new()
        }).ToList();
    }
}