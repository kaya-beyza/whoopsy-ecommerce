using MediatR;

namespace MiniETicaret.Application.Features.Cart.Commands.AddToCart;

public class AddToCartCommand : IRequest<Guid>
{
    public Guid UserId { get; set; }
    public Guid ProductId { get; set; }
    public int Quantity { get; set; }
}