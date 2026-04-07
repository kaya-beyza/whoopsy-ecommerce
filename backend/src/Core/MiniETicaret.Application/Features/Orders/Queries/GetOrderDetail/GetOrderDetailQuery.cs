using MediatR;
using MiniETicaret.Application.DTOs;

namespace MiniETicaret.Application.Features.Orders.Queries.GetOrderDetail;

public class GetOrderDetailQuery : IRequest<OrderDetailDto>
{
    public Guid OrderId { get; set; }
}