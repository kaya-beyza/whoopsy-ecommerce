using MediatR;
using MiniETicaret.Application.DTOs;
using MiniETicaret.Application.Interfaces;

namespace MiniETicaret.Application.Features.Cart.Queries.GetUserCart;

public class GetUserCartQueryHandler : IRequestHandler<GetUserCartQuery, List<CartItemDto>>
{
    private readonly ICartRepository _cartRepository;

    public GetUserCartQueryHandler(ICartRepository cartRepository)
    {
        _cartRepository = cartRepository;
    }

    public async Task<List<CartItemDto>> Handle(GetUserCartQuery request, CancellationToken cancellationToken)
    {
        var cartItems = await _cartRepository.GetByUserIdAsync(request.UserId);

        var cartItemDtos = cartItems.Select(c => new CartItemDto
        {
            ProductId = c.ProductId,
            ProductName = c.Product?.Name ?? string.Empty,
            Price = c.Product?.Price ?? 0,
            MainImageUrl = c.Product?.Images?.FirstOrDefault(i => i.IsMain)?.Url,
            Quantity = c.Quantity,
            TotalPrice = (c.Product?.Price ?? 0) * c.Quantity
        }).ToList();

        return cartItemDtos;
    }
}