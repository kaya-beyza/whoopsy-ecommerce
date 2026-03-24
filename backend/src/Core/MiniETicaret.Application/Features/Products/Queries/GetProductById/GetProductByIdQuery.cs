using MediatR;
using MiniETicaret.Application.Features.Products.DTOs;

namespace MiniETicaret.Application.Features.Products.Queries.GetProductById;

public record GetProductByIdQuery(Guid Id) : IRequest<ProductDto>;