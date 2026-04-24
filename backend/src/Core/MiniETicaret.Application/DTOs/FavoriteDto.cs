namespace MiniETicaret.Application.DTOs;

public class FavoriteDto
{
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string? MainImageUrl { get; set; }
    public DateTime AddedAt { get; set; }
}