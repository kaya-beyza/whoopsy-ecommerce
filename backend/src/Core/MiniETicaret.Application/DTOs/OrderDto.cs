using MiniETicaret.Domain.Enums;
namespace MiniETicaret.Application.DTOs;

public class OrderDto // Siparişin özeti: tutar, durum, adres, tarih ve içindeki ürünler
{
    public Guid Id { get; set; }
    public decimal TotalAmount { get; set; }
    public OrderStatus Status { get; set; }
    public string ShippingAddress { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }
    public List<OrderItemDto> OrderItems { get; set; } = new();
}
public class OrderItemDto  // Siparişteki her bir ürün: hangi ürün, kaç adet, birim fiyat, toplam fiyat
{
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
}