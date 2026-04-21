using MediatR;

namespace MiniETicaret.Application.Features.Cart.Commands.UpdateCartItem;

public class UpdateCartItemCommand : IRequest<Unit>
{
    public Guid UserId { get; set; }
    public Guid ProductId { get; set; }
    public int Quantity { get; set; }
}