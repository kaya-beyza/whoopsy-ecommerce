using MediatR;
using MiniETicaret.Application.DTOs;
using MiniETicaret.Application.Interfaces;

namespace MiniETicaret.Application.Features.Orders.Queries.GetOrders;

public class GetOrdersQueryHandler : IRequestHandler<GetOrdersQuery, PaginatedResult<OrderDto>>
{
    private readonly IOrderRepository _orderRepository;

    public GetOrdersQueryHandler(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task<PaginatedResult<OrderDto>> Handle(GetOrdersQuery request, CancellationToken cancellationToken)
    {
        // 1) Siparişleri getir (sayfalama + opsiyonel filtre)
        var orders = await _orderRepository.GetAllAsync(request.Page, request.Size, request.Status);

        // 2) Toplam kayıt sayısını al (aynı filtre ile)
        var totalCount = await _orderRepository.GetTotalCountAsync(request.Status);

        // 3) Entity'leri DTO'lara dönüştür
        var orderDtos = orders.Select(order => new OrderDto
        {
            Id = order.Id,
            TotalAmount = order.TotalAmount,
            Status = order.Status,
            ShippingAddress = order.ShippingAddress,
            CreatedDate = order.CreatedDate,
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
        }).ToList();

        // 4) PaginatedResult içinde paketle ve döndür
        return new PaginatedResult<OrderDto>
        {
            Items = orderDtos,
            TotalCount = totalCount,
            Page = request.Page,
            Size = request.Size
        };
    }
}