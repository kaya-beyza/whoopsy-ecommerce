using MediatR;
using MiniETicaret.Application.Features.Products.DTOs;
using MiniETicaret.Application.DTOs;
using MiniETicaret.Domain.Enums;

namespace MiniETicaret.Application.Features.Products.Queries.GetProductsByFilter;

public record GetProductsByFilterQuery(
    Gender? Gender = null,
    Brand? Brand = null,
    Guid? CategoryId = null,
    string? SearchTerm = null,
    int Page = 1,
    int PageSize = 21
) : IRequest<PagedResultDto<ProductDto>>;