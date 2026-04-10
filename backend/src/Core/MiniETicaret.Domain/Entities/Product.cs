using System.ComponentModel;
using MiniETicaret.Domain.Common;
using MiniETicaret.Domain.Enums;

namespace MiniETicaret.Domain.Entities;

public class Product : BaseEntity
{
    public string Name {get;set;} = string.Empty;
    public string Description {get;set;} = string.Empty;
    public decimal Price {get;set;}
    public int StockQuantity {get;set;}
    public Guid CategoryId {get;set;}
    public bool IsActive {get;set;} = true;
    public Gender Gender {get;set;}
    public Brand Brand {get;set;}
    public Category Category {get;set;} = null!;
    public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
}