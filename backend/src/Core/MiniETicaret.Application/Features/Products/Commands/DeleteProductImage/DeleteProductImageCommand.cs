using MediatR;

namespace MiniETicaret.Application.Features.Products.Commands.DeleteProductImage;

public record DeleteProductImageCommand(
    Guid ProductId,
    Guid ImageId
) : IRequest<bool>;