using MediatR;
using MiniETicaret.Application.Features.Products.DTOs;
using MiniETicaret.Application.DTOs;
using MiniETicaret.Domain.Enums;

namespace MiniETicaret.Application.Features.Products.Queries.GetProductsByBrand;

public record GetProductsByBrandQuery(Brand Brand, int Page = 1, int PageSize = 20) : IRequest<PagedResultDto<ProductDto>>;