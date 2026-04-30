using MediatR;
using MiniETicaret.Application.Features.Products.DTOs;
using MiniETicaret.Application.DTOs;

namespace MiniETicaret.Application.Features.Products.Queries.GetProducts;

public record GetProductsQuery(int Page = 1, int PageSize = 20) : IRequest<PagedResultDto<ProductDto>>;