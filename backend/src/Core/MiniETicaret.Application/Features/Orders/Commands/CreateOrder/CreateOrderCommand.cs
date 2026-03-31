using MediatR;

  namespace MiniETicaret.Application.Features.Orders.Commands.CreateOrder;

  public class CreateOrderCommand : IRequest<Guid>
  {
      public Guid UserId { get; set; }
      public string ShippingAddress { get; set; } = string.Empty;
      public List<CreateOrderItemDto> OrderItems { get; set; } = new();
  }

  public class CreateOrderItemDto
  {
      public Guid ProductId { get; set; }
      public int Quantity { get; set; }
      public decimal UnitPrice { get; set; }
  }