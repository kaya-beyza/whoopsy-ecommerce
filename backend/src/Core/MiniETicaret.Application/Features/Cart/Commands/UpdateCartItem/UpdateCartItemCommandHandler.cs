using MediatR;
using MiniETicaret.Application.Interfaces;

namespace MiniETicaret.Application.Features.Cart.Commands.UpdateCartItem;

public class UpdateCartItemCommandHandler : IRequestHandler<UpdateCartItemCommand, Unit>
{
    private readonly ICartRepository _cartRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateCartItemCommandHandler(ICartRepository cartRepository, IUnitOfWork unitOfWork)
    {
        _cartRepository = cartRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Unit> Handle(UpdateCartItemCommand request, CancellationToken cancellationToken)
    {
        var cartItem = await _cartRepository.GetAsync(request.UserId, request.ProductId);
        if (cartItem == null)
            throw new Exception("Bu ürün sepetinizde bulunamadı.");

        cartItem.Quantity = request.Quantity;
        await _cartRepository.UpdateAsync(cartItem);
        await _unitOfWork.SaveChangesAsync();

        return Unit.Value;
    }
}