using MediatR;
using MiniETicaret.Application.Features.Products.DTOs;
using MiniETicaret.Domain.Enums;

namespace MiniETicaret.Application.Features.Products.Queries.GetProductsByBrand;

public record GetProductsByBrandQuery(Brand Brand) : IRequest<List<ProductDto>>;