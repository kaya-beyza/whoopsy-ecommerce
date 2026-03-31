using MediatR;
using MiniETicaret.Application.Interfaces;

namespace MiniETicaret.Application.Features.Orders.Commands.UpdateOrderStatus;

public class UpdateOrderStatusCommandHandler : IRequestHandler<UpdateOrderStatusCommand, Unit>
{
    private readonly IOrderRepository _orderRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateOrderStatusCommandHandler(IOrderRepository orderRepository, IUnitOfWork unitOfWork)
    {
        _orderRepository = orderRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Unit> Handle(UpdateOrderStatusCommand request, CancellationToken cancellationToken)
    {
        // 1) Siparişi veritabanından getir
        var order = await _orderRepository.GetByIdAsync(request.OrderId);

        // 2) Sipariş bulunamazsa hata fırlat
        if (order is null)
            throw new KeyNotFoundException($"Sipariş bulunamadı: {request.OrderId}");

        // 3) Durumu güncelle
        order.Status = request.NewStatus;
        order.UpdatedDate = DateTime.UtcNow;

        // 4) Veritabanına kaydet
        await _orderRepository.UpdateAsync(order);
        await _unitOfWork.SaveChangesAsync();

        // 5) Geriye anlamlı bir şey dönmüyoruz
        return Unit.Value;
    }
}