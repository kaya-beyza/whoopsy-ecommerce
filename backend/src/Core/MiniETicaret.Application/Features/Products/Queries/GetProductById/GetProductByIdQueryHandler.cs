using MediatR;
using MiniETicaret.Application.Features.Products.DTOs;
using MiniETicaret.Application.Interfaces;
using MiniETicaret.Domain.Enums;

namespace MiniETicaret.Application.Features.Products.Queries.GetProductById;

public class GetProductByIdQueryHandler : IRequestHandler<GetProductByIdQuery, ProductDto>
{
    private readonly IProductRepository _productRepository;
    public GetProductByIdQueryHandler(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<ProductDto> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
    {
        var product = await _productRepository.GetByIdAsync(request.Id, cancellationToken);

        if (product == null)
            return null!;

        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            StockQuantity = product.StockQuantity,
            CategoryId = product.CategoryId,
            CategoryName = product.Category?.Name ?? "",
            Gender = product.Gender,
            MainImageUrl = product.Images?.FirstOrDefault(i => i.IsMain)?.Url,
            ImageUrls = product.Images?.Select(i => i.Url).ToList() ?? new()
        };
    }
}
