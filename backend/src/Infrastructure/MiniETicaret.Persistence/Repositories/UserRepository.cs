using Microsoft.EntityFrameworkCore;
using MiniETicaret.Application.Interfaces;
using MiniETicaret.Domain.Entities;
using MiniETicaret.Persistence.Context;
namespace MiniETicaret.Persistence.Repositories;

/*"veritabanından kullanıcıyı getir, ekle, güncelle" gibi method tanımları
  vardı. Şimdi bu tanımları gerçek veritabanı koduyla dolduracağız. */

public class UserRepository : IUserRepository
{
    private readonly MiniETicaretDbContext _context; //Handler'larda IUserRepository alıyordun, burada ise DbContext alıyorsun. Bu gerçek veritabanı bağlantısı.

    public UserRepository(MiniETicaretDbContext context)
    {
        _context = context;
    }

    public async Task<AppUser?> GetByIdAsync(Guid id)
    {
        return await _context.Users
            .Include(u => u.Role)  //Join işlemi join yapılıyor
            .FirstOrDefaultAsync(u => u.Id == id);  // ID'si eşleşen ilk kaydı getir.
    }
    public async Task<AppUser?> GetByEmailAsync(string email)
    {
        return await _context.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Email == email);
    }
    public async Task<List<AppUser>> GetAllAsync(int page, int size)
    {
        return await _context.Users
            .Include(u => u.Role)
            .Skip((page - 1) * size)   /*- Sayfa 1, boyut 10 → Skip(0), Take(10) → İlk 10 kayıt                                                                                                  
                                         - Sayfa 2, boyut 10 → Skip(10), Take(10) → 11-20 arası kayıtlar                                                                                         
                                         - Sayfa 3, boyut 10 → Skip(20), Take(10) → 21-30 arası kayıtlar*/
            .Take(size).ToListAsync();
    }

    public async Task<AppUser?> GetByRefreshTokenAsync(string refreshToken) //"Kullanıcının token listesinde bu token var mı?" diye kontrol ediyor. .Any() = "herhangi biri eşleşiyor mu?"
    {
        return await _context.Users
            .Include(u => u.RefreshTokens)
            .FirstOrDefaultAsync(u => u.RefreshTokens.Any(rt => rt.Token == refreshToken));
    }
    public async Task<int> GetTotalCountAsync()
    {
        return await _context.Users.CountAsync();
    }

    public async Task<AppUser> AddAsync(AppUser user)
    {
        await _context.Users.AddAsync(user);
        return user;
    }

    public async Task UpdateAsync(AppUser user)
    {
        _context.Users.Update(user);
        await Task.CompletedTask;
    }

    public async Task<AppUser?> GetByIdWithOrdersAsync(Guid id)
{
    return await _context.Users
        .Include(u => u.Orders)
            .ThenInclude(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                    .ThenInclude(p => p.Images)
        .FirstOrDefaultAsync(u => u.Id == id);
}

    public async Task<AppUser?> GetByApprovalTokenAsync(Guid token)
    {
        return await _context.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.ApprovalToken == token);
    }

}