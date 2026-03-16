using MiniEticaret.Domain.Common;
namespace MiniEticaret.Domain.Entities;

public class RefreshToken : BaseEntity
{
    public string Token{get;set;} =string.Empty;
    public DateTime ExpiresAt{get;set;}
    public bool IsRboked{get;set;}=false;

    //Navigation Propery
    public Guid AppUserId{get;set;}
    public AppUser AppUser{get;set;}=null!;
}