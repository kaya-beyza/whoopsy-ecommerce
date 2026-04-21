using MediatR;
using MiniETicaret.Application.Interfaces;

namespace MiniETicaret.Application.Features.Cart.Commands.ClearCart;

public class ClearCartCommandHandler : IRequestHandler<ClearCartCommand, Unit>
{
    private readonly ICartRepository _cartRepository;
    private readonly IUnitOfWork _unitOfWork;

    public ClearCartCommandHandler(ICartRepository cartRepository, IUnitOfWork unitOfWork)
    {
        _cartRepository = cartRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Unit> Handle(ClearCartCommand request, CancellationToken cancellationToken)
    {
        await _cartRepository.ClearByUserIdAsync(request.UserId);
        await _unitOfWork.SaveChangesAsync();

        return Unit.Value;
    }
}