using MediatR;
using MiniETicaret.Application.Interfaces;
using MiniETicaret.Application.Features.Products.DTOs;
using MiniETicaret.Domain.Enums;

namespace MiniETicaret.Application.Features.Products.Queries.GetProductsByFilter;

public class GetProductsByFilterQueryHandler : IRequestHandler<GetProductsByFilterQuery, List<ProductDto>>
{
    private readonly IProductRepository _productRepository;

    public GetProductsByFilterQueryHandler(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<List<ProductDto>> Handle(GetProductsByFilterQuery request, CancellationToken cancellationToken)
    {
        var products = await _productRepository.GetByFilterAsync(request.Gender, request.Brand, request.CategoryId, cancellationToken);

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