using MiniETicaret.Domain.Enums;

  namespace MiniETicaret.Application.DTOs;

  public class OrderDetailDto
  {
      public Guid Id { get; set; }
      public Guid UserId { get; set; }
      public string UserFullName { get; set; } = string.Empty;
      public string UserEmail { get; set; } = string.Empty;
      public decimal TotalAmount { get; set; }
      public OrderStatus Status { get; set; }
      public string ShippingAddress { get; set; } = string.Empty;
      public DateTime CreatedDate { get; set; }
      public DateTime? UpdatedDate { get; set; }
      public List<OrderItemDto> OrderItems { get; set; } = new();
  }