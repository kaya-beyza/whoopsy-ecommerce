using MiniETicaret.Domain.Entities;

namespace MiniETicaret.Application.Interfaces;

public interface IFavoriteRepository
{
    Task<Favorite?> GetAsync(Guid userId, Guid productId);
    Task<List<Favorite>> GetByUserIdAsync(Guid userId);
    Task AddAsync(Favorite favorite);
    Task RemoveAsync(Favorite favorite);
}