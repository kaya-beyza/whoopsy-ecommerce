using MediatR;
using MiniETicaret.Application.Features.Products.DTOs;
using MiniETicaret.Application.Interfaces;
using MiniETicaret.Application.DTOs;

namespace MiniETicaret.Application.Features.Products.Queries.GetProductsByGender;

public class GetProductsByGenderHandler : IRequestHandler<GetProductsByGenderQuery, PagedResultDto<ProductDto>>
{
    private readonly IProductRepository _productRepository;

    public GetProductsByGenderHandler(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<PagedResultDto<ProductDto>> Handle(GetProductsByGenderQuery request, CancellationToken cancellationToken)
    {
        var (products, totalCount) = await _productRepository.GetByGenderAsync(request.Gender, request.CategoryId, cancellationToken, request.Page, request.PageSize);

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