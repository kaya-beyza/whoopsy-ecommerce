using MediatR;
using MiniETicaret.Domain.Enums;

namespace MiniETicaret.Application.Features.Products.Commands.UpdateProduct;

public record UpdateProductCommand
(
    Guid Id,
    string Name,
    string Description,
    decimal Price,
    int StockQuantity,
    Guid CategoryId,
    Gender Gender,
    bool IsActive
) : IRequest<bool>;

