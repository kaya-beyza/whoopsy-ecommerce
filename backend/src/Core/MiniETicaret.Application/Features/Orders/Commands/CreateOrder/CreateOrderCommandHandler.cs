using MediatR;
using MiniETicaret.Application.Interfaces;
using MiniETicaret.Domain.Entities;

namespace MiniETicaret.Application.Features.Orders.Commands.CreateOrder;

public class CreateOrderCommandHandler : IRequestHandler<CreateOrderCommand, Guid>
{
    private readonly IOrderRepository _orderRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateOrderCommandHandler(
        IOrderRepository orderRepository,
        IUnitOfWork unitOfWork)
    {
        _orderRepository = orderRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
    {
        // 1) Command'dan gelen DTO'ları OrderItem entity'lerine dönüştür
        var orderItems = request.OrderItems.Select(item => new OrderItem
        {
            ProductId = item.ProductId,
            Quantity = item.Quantity,
            UnitPrice = item.UnitPrice,
            CreatedDate = DateTime.UtcNow.AddHours(3)
        }).ToList();

        // 2) TotalAmount'u sunucu tarafında hesapla (güvenlik için)
        var totalAmount = orderItems.Sum(item => item.Quantity * item.UnitPrice);

        // 3) Order entity'sini oluştur
        var order = new Order
        {
            UserId = request.UserId,
            ShippingAddress = request.ShippingAddress,
            TotalAmount = totalAmount,
            OrderItems = orderItems,
            CreatedDate = DateTime.UtcNow.AddHours(3)
        };

        // 4) Veritabanına kaydet
        await _orderRepository.AddAsync(order);
        await _unitOfWork.SaveChangesAsync();

        // 5) Sipariş onay maili burada GÖNDERİLMEZ.
        //    Mail, CreatePaymentCommandHandler'da ödeme başarılı olduğunda yollanır
        //    (başarısız ödemede kullanıcıya yanıltıcı "siparişin alındı" maili gitmesin diye).

        return order.Id;
    }
}
