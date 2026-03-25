using MediatR;
using MiniETicaret.Application.DTOs;
using MiniETicaret.Domain.Enums;

namespace MiniETicaret.Application.Features.Orders.Queries.GetOrders;

public class GetOrdersQuery : IRequest<PaginatedResult<OrderDto>>
{
    public int Page { get; set; } = 1;
    public int Size { get; set; } = 10;
    public OrderStatus? Status { get; set; }
}