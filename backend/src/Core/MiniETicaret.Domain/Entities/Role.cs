using MiniEticaret.Domain.Common;
namespace MiniEticaret.Domain.Entities;

public class Role : BaseEntity
{
    public string Name{get;set;}=string.Empty;
    public string Desctiption{get;set;}=string.Empty;

    // Navigation Property
    public ICollection<AppUser>Users{get;set;} = new List<AppUsers>();
}