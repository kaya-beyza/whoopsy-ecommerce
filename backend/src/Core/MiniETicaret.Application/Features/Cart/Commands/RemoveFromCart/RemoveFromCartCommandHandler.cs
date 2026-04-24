using MediatR;
using MiniETicaret.Application.Interfaces;

namespace MiniETicaret.Application.Features.Cart.Commands.RemoveFromCart;

public class RemoveFromCartCommandHandler : IRequestHandler<RemoveFromCartCommand, Unit>
{
    private readonly ICartRepository _cartRepository;
    private readonly IUnitOfWork _unitOfWork;

    public RemoveFromCartCommandHandler(ICartRepository cartRepository, IUnitOfWork unitOfWork)
    {
        _cartRepository = cartRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Unit> Handle(RemoveFromCartCommand request, CancellationToken cancellationToken)
    {
        var cartItem = await _cartRepository.GetAsync(request.UserId, request.ProductId);
        if (cartItem == null)
            throw new Exception("Bu ürün sepetinizde bulunamadı.");

        await _cartRepository.RemoveAsync(cartItem);
        await _unitOfWork.SaveChangesAsync();

        return Unit.Value;
    }
}