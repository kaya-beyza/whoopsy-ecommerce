using MediatR;
using MiniETicaret.Application.Features.Products.DTOs;

namespace MiniETicaret.Application.Features.Products.Queries.GetProductsByCategory;

public record GetProductsByCategoryQuery(Guid CategoryId, int Page = 1, int PageSize = 20) : IRequest<List<ProductDto>>;