using System.ComponentModel;
using MiniETicaret.Domain.Common;

namespace MiniETicaret.Domain.Entities;

public class Product : BaseEntity
{
    public string Name {get;set;} = string.Empty;
    public string Description {get;set;} = string.Empty;
    public decimal Price {get;set;}
    public int StockQuantity {get;set;}
    public Guid CategoryId {get;set;}
    public bool IsActive {get;set;} = true;
    public Category Category {get;set;} = null!;   
    
}