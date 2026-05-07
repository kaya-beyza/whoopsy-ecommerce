using MediatR;
using MiniETicaret.Application.DTOs;
using MiniETicaret.Application.Interfaces;
namespace MiniETicaret.Application.Features.Auth.Queries.GetUserOrderHistory;

public class GetUserOrderHistoryQueryHandler : IRequestHandler<GetUserOrderHistoryQuery, List<OrderDto>>
{
    private readonly IUserRepository _userRepository;
    public GetUserOrderHistoryQueryHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<List<OrderDto>> Handle(GetUserOrderHistoryQuery request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdWithOrdersAsync(request.UserId);
        if (user == null) throw new Exception($"User with ID {request.UserId} not found.");
        return user.Orders.Select(order => new OrderDto
        {
            Id = order.Id,
            TotalAmount = order.TotalAmount,
            Status = order.Status,
            ShippingAddress = order.ShippingAddress,
            CreatedDate = order.CreatedDate,
           OrderItems = order.OrderItems.Select(item => new OrderItemDto
{
    ProductId = item.ProductId,
    ProductName = item.Product?.Name ?? "Unknown",

    ImageUrl = item.Product?.Images
        ?.OrderByDescending(i => i.IsMain)
        .ThenBy(i => i.DisplayOrder)
        .Select(i => i.Url)
        .FirstOrDefault() ?? string.Empty,

    Quantity = item.Quantity,
    UnitPrice = item.UnitPrice,
    TotalPrice = item.TotalPrice
}).ToList()
        }).ToList();
    }
}