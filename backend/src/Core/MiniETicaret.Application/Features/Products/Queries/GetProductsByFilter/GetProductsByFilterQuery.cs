using MediatR;
using MiniETicaret.Application.Features.Products.DTOs;
using MiniETicaret.Domain.Enums;

namespace MiniETicaret.Application.Features.Products.Queries.GetProductsByFilter;

public record GetProductsByFilterQuery(
    Gender? Gender = null,
    Brand? Brand = null,
    Guid? CategoryId = null
) : IRequest<List<ProductDto>>;