using MediatR;
using MiniETicaret.Application.Features.Products.DTOs;
using MiniETicaret.Domain.Enums;

namespace MiniETicaret.Application.Features.Products.Queries.GetProductsByGender;

public record GetProductsByGenderQuery(
    Gender? Gender = null,
    Guid? CategoryId = null,
    int? Page = 1,
    int? PageSize = 21
) : IRequest<List<ProductDto>>;