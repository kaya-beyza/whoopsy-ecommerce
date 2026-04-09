namespace MiniETicaret.Application.Features.Products.DTOs;

  public class ProductImageDto
  {
      public Guid Id { get; set; }
      public string PublicId { get; set; } = string.Empty;
      public string Url { get; set; } = string.Empty;
      public bool IsMain { get; set; }
      public int DisplayOrder { get; set; }
  }