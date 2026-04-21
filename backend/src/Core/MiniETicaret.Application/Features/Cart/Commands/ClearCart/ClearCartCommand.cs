using MediatR;

namespace MiniETicaret.Application.Features.Cart.Commands.ClearCart;

public class ClearCartCommand : IRequest<Unit>
{
    public Guid UserId { get; set; }
}