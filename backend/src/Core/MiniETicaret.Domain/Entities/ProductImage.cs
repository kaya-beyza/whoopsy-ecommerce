using MiniETicaret.Domain.Common;

  namespace MiniETicaret.Domain.Entities;

  public class ProductImage : BaseEntity
  {
      public string PublicId { get; set; } = string.Empty;
      public string Url { get; set; } = string.Empty;
      public bool IsMain { get; set; }
      public int DisplayOrder { get; set; } // Birden fazla görsel varsa sıralama numarası (0, 1, 2...) 

      // Foreign Key
      public Guid ProductId { get; set; }
      public Product Product { get; set; } = null!;
  }