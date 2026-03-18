using MiniETicaret.Domain.Common;

namespace MiniETicaret.Domain.Entities;

public class OrderItem : BaseEntity
{
    public Guid OrderId {get;set;}
    public Order Order {get;set;} = null!;

    public Guid ProductId {get;set;}
    public Product Product {get;set;} = null!; // normalde eklememiştim ama kontrol ettirince bunun da olması gerektiğini gördüm,
                                               // çünkü orderitem üzerinden product bilgilerine erişmek istediğimizde bu ilişkiyi kurmamız gerekiyor
    public int Quantity {get;set;}
    public decimal UnitPrice {get;set;}

    public decimal TotalPrice => Quantity * UnitPrice; // bir kullanıcının alacağı ürünün toplam fiyatını hesaplamak için kullanılıyor 2xadet ayakkabı 2x10tl gibi kolaylık sağlar inş

}