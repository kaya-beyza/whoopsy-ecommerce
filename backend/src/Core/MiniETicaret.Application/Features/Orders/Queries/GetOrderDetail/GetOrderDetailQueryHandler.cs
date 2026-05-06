using MediatR;
using MiniETicaret.Application.DTOs;
using MiniETicaret.Application.Interfaces;

namespace MiniETicaret.Application.Features.Orders.Queries.GetOrderDetail;

public class GetOrderDetailQueryHandler : IRequestHandler<GetOrderDetailQuery, OrderDetailDto>
{
    private readonly IOrderRepository _orderRepository;

    public GetOrderDetailQueryHandler(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task<OrderDetailDto> Handle(GetOrderDetailQuery request, CancellationToken cancellationToken)
    {
        // 1) Siparişi detaylarıyla birlikte getir (Include'lar repository'de)
        var order = await _orderRepository.GetByIdWithDetailsAsync(request.OrderId);

        // 2) Sipariş bulunamazsa hata fırlat
        if (order is null)
            throw new KeyNotFoundException($"Sipariş bulunamadı: {request.OrderId}");

        // 3) Entity'yi OrderDetailDto'ya dönüştür
        return new OrderDetailDto
        {
            Id = order.Id,
            UserId = order.UserId,
            UserFullName = order.User?.FullName ?? string.Empty,
            UserEmail = order.User?.Email ?? string.Empty,
            TotalAmount = order.TotalAmount,
            Status = order.Status,
            ShippingAddress = order.ShippingAddress,
            CreatedDate = order.CreatedDate,
            UpdatedDate = order.UpdatedDate,
            OrderItems = order.OrderItems.Select(item => new OrderItemDto
            {
                ProductId = item.ProductId,
                ProductName = item.Product?.Name ?? string.Empty,
                ImageUrl = item.Product?.Images
                    .OrderByDescending(i => i.IsMain)
                    .ThenBy(i => i.DisplayOrder)
                    .Select(i => i.Url)
                    .FirstOrDefault() ?? string.Empty,
                Quantity = item.Quantity,
                UnitPrice = item.UnitPrice,
                TotalPrice = item.TotalPrice
            }).ToList()
        };
    }
}