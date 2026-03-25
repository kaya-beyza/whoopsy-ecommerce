using MediatR;
  using MiniETicaret.Domain.Enums;

  namespace MiniETicaret.Application.Features.Orders.Commands.UpdateOrderStatus;

  public class UpdateOrderStatusCommand : IRequest<Unit>
  {
      public Guid OrderId { get; set; }
      public OrderStatus NewStatus { get; set; }
  }