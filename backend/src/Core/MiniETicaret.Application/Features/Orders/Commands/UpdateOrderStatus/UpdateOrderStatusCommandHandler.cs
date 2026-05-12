using MediatR;
using MiniETicaret.Application.Interfaces;
using MiniETicaret.Domain.Enums;
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
        var order = await _orderRepository.GetByIdAsync(request.OrderId);

        if (order is null)
            throw new KeyNotFoundException($"Sipariş bulunamadı: {request.OrderId}");

        // Hangi yöne geçmek istediğine göre Order'ın ilgili method'unu çağır.
        // Geçersiz geçişlerde InvalidOperationException Order'ın kendisinden gelir.
        switch (request.NewStatus)
        {
            case OrderStatus.Confirmed: order.Confirm(); break;
            case OrderStatus.Shipped: order.Ship(); break;
            case OrderStatus.Delivered: order.Deliver(); break;
            case OrderStatus.Cancelled: order.Cancel(); break;
            case OrderStatus.ReturnRequested: order.RequestReturn(); break;
            case OrderStatus.ReturnApproved: order.ApproveReturn(); break;
            case OrderStatus.ReturnRejected: order.RejectReturn(); break;
            case OrderStatus.Returned: order.CompleteReturn(); break;
            default:
                throw new InvalidOperationException($"Desteklenmeyen hedef durum: {request.NewStatus}.");
        }

        order.UpdatedDate = DateTime.UtcNow;

        await _orderRepository.UpdateAsync(order);
        await _unitOfWork.SaveChangesAsync();

        return Unit.Value;
    }
}