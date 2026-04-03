using MediatR;
using MiniETicaret.Application.Features.Products.DTOs;

namespace MiniETicaret.Application.Features.Products.Queries.GetProductsByCategory;

public record GetProductsByCategoryQuery(Guid CategoryId) : IRequest<List<ProductDto>>;