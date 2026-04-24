namespace MiniETicaret.Application.DTOs;

public class CartItemDto
{
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string? MainImageUrl { get; set; }
    public int Quantity { get; set; }
    public decimal TotalPrice { get; set; }
}