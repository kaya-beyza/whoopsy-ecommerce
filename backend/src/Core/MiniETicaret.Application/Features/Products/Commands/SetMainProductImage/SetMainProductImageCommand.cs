using MediatR;

namespace MiniETicaret.Application.Features.Products.Commands.SetMainProductImage;

public record SetMainProductImageCommand(
    Guid ProductId,
    Guid ImageId
) : IRequest<bool>;