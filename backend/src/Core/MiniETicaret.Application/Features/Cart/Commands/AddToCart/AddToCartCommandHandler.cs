using MediatR;
using MiniETicaret.Application.Interfaces;
using MiniETicaret.Domain.Entities;

namespace MiniETicaret.Application.Features.Cart.Commands.AddToCart;

public class AddToCartCommandHandler : IRequestHandler<AddToCartCommand, Guid>
{
    private readonly ICartRepository _cartRepository;
    private readonly IUnitOfWork _unitOfWork;

    public AddToCartCommandHandler(ICartRepository cartRepository, IUnitOfWork unitOfWork)
    {
        _cartRepository = cartRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> Handle(AddToCartCommand request, CancellationToken cancellationToken)
    {
        // 1) Bu ürün zaten sepette mi kontrol et
        var existing = await _cartRepository.GetAsync(request.UserId, request.ProductId);

        if (existing != null)
        {
            // 2a) Zaten varsa adeti artır
            existing.Quantity += request.Quantity;
            await _cartRepository.UpdateAsync(existing);
            await _unitOfWork.SaveChangesAsync();
            return existing.Id;
        }

        // 2b) Yoksa yeni ekle
        var cartItem = new CartItem
        {
            UserId = request.UserId,
            ProductId = request.ProductId,
            Quantity = request.Quantity,
            CreatedDate = DateTime.UtcNow.AddHours(3)
        };

        await _cartRepository.AddAsync(cartItem);
        await _unitOfWork.SaveChangesAsync();

        return cartItem.Id;
    }
}