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
}