using MiniETicaret.Domain.Common;

  namespace MiniETicaret.Domain.Entities;

  public class CartItem : BaseEntity
  {
      public Guid UserId { get; set; }
      public AppUser User { get; set; } = null!;

      public Guid ProductId { get; set; }
      public Product Product { get; set; } = null!;

      public int Quantity { get; set; }
  }