using MediatR;

namespace MiniETicaret.Application.Features.Cart.Commands.RemoveFromCart;

public class RemoveFromCartCommand : IRequest<Unit>
{
    public Guid UserId { get; set; }
    public Guid ProductId { get; set; }
}