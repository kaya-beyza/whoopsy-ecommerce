using MediatR;
using MiniETicaret.Application.DTOs;

namespace MiniETicaret.Application.Features.Cart.Queries.GetUserCart;

public class GetUserCartQuery : IRequest<List<CartItemDto>>
{
    public Guid UserId { get; set; }
}