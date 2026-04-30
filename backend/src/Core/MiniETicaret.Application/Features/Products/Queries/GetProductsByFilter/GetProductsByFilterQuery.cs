using MediatR;
using MiniETicaret.Application.Features.Products.DTOs;
using MiniETicaret.Application.DTOs;
using MiniETicaret.Domain.Enums;

namespace MiniETicaret.Application.Features.Products.Queries.GetProductsByFilter;

public record GetProductsByFilterQuery(
    List<Gender>? Genders = null,
    List<Brand>? Brands = null,
    List<Guid>? CategoryIds = null,
    string? SearchTerm = null,
    int Page = 1,
    int PageSize = 21
) : IRequest<PagedResultDto<ProductDto>>;