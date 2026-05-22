using MiniETicaret.Domain.Entities;
namespace MiniETicaret.Application.Interfaces;

public interface IUserRepository
{
    Task<AppUser?> GetByIdAsync(Guid id);
    Task<AppUser?> GetByEmailAsync(string email);
    Task<List<AppUser>> GetAllAsync(int page,int size);
    Task<AppUser?> GetByRefreshTokenAsync(string refreshToken);
    Task<int> GetTotalCountAsync();
    Task<AppUser> AddAsync(AppUser user);
    Task UpdateAsync(AppUser user);

    //GetByIdAsync sadece kullanıcı + rol getiriyordu. Bu yeni method kullanıcı + siparişler + sipariş ürünleri getirecek. Her seferinde     tüm ilişkileri yüklemek performansı düşürür, o yüzden ihtiyaca göre ayrı method'lar yazarız.
    Task<AppUser?> GetByIdWithOrdersAsync(Guid id);

    // Admin approval flow: onay/red linkindeki token ile kullanıcıyı bulur.
    Task<AppUser?> GetByApprovalTokenAsync(Guid token);
}