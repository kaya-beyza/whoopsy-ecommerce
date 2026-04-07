using MediatR;
using MiniETicaret.Application.Features.Products.DTOs;

namespace MiniETicaret.Application.Features.Products.Queries.GetProducts;

public record GetProductsQuery() : IRequest<List<ProductDto>>;