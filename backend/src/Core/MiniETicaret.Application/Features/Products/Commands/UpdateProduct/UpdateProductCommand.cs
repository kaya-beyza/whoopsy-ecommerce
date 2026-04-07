using MediatR;

namespace MiniETicaret.Application.Features.Products.Commands.UpdateProduct;

public record UpdateProductCommand
(
    Guid Id,
    string Name,
    string Description,
    decimal Price,
    int StockQuantity,
    Guid CategoryId,
    bool IsActive
) : IRequest<bool>;

