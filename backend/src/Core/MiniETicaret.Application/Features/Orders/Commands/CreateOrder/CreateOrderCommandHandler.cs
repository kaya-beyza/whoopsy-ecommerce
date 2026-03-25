using MediatR;
using MiniETicaret.Application.Interfaces;
using MiniETicaret.Domain.Entities;
using MiniETicaret.Domain.Enums;

namespace MiniETicaret.Application.Features.Orders.Commands.CreateOrder;

public class CreateOrderCommandHandler : IRequestHandler<CreateOrderCommand, Guid>
{
    private readonly IOrderRepository _orderRepository;

    public CreateOrderCommandHandler(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task<Guid> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
    {
        // 1) Command'dan gelen DTO'ları OrderItem entity'lerine dönüştür
        var orderItems = request.OrderItems.Select(item => new OrderItem
        {
            ProductId = item.ProductId,
            Quantity = item.Quantity,
            UnitPrice = item.UnitPrice
        }).ToList();

        // 2) TotalAmount'u sunucu tarafında hesapla (güvenlik için)
        var totalAmount = orderItems.Sum(item => item.Quantity * item.UnitPrice);

        // 3) Order entity'sini oluştur
        var order = new Order
        {
            UserId = request.UserId,
            ShippingAddress = request.ShippingAddress,
            Status = OrderStatus.Pending,
            TotalAmount = totalAmount,
            OrderItems = orderItems,
            CreatedDate = DateTime.UtcNow
        };

        // 4) Veritabanına kaydet
        await _orderRepository.AddAsync(order);

        // 5) Yeni siparişin Id'sini döndür
        return order.Id;
    }
}