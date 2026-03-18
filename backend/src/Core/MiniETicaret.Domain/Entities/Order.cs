using MiniETicaret.Domain.Common;
using MiniETicaret.Domain.Enums;


namespace MiniETicaret.Domain.Entities;

public class Order : BaseEntity
{
    public Guid UserId {get;set;}
    public AppUser User {get;set;} = null!; //Kullanıcı bilgisine burdan erişecepiz
    public decimal TotalAmount {get;set;}
    public OrderStatus Status {get;set;} = OrderStatus.Pending;

    public string ShippingAddress {get;set;} = string.Empty;
    public ICollection<OrderItem> OrderItems {get;set;} = new List<OrderItem>();

}