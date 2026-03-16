using MiniEticaret.Domain.Common;
namespace MiniEticaret.Domain.Entities;
public class AppUser : BaseEntity
{
    public string FullName{get;set;} =string.Empty;
    public string Email{get;set;}=string.Empty;
    public string PasswordHash {get;set;} =string.Empty;
    public bool IsActive{get;set;}=true;

    //Navigation Properties
    public Guid RoleId{get;set;}
    public Role Role {get;set;}=null;//?????
    public ICollection<Order>Orders {get;set;}=newList<Order>();
    public ICollection<RefreshToken> RefreshTokens{get;set;}=new List<RefreshToken>();
}