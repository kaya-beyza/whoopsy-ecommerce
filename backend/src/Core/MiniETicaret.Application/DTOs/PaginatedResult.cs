namespace MiniETicaret.Application.DTOs;

  public class PaginatedResult<T>
  {
      public List<T> Items { get; set; } = new();
      public int TotalCount { get; set; }
      public int Page { get; set; }
      public int Size { get; set; }
      public int TotalPages => (int)Math.Ceiling((double)TotalCount / Size);
  }