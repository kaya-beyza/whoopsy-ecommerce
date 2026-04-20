using Microsoft.EntityFrameworkCore;
using MiniETicaret.Application.Interfaces;
using MiniETicaret.Domain.Entities;
using MiniETicaret.Persistence.Context;

namespace MiniETicaret.Persistence.Repositories;

public class FavoriteRepository : IFavoriteRepository
{
    private readonly MiniETicaretDbContext _context;

    public FavoriteRepository(MiniETicaretDbContext context)
    {
        _context = context;
    }

    public async Task<Favorite?> GetAsync(Guid userId, Guid productId)
    {
        return await _context.Favorites
            .FirstOrDefaultAsync(f => f.UserId == userId && f.ProductId == productId);
    }

    public async Task<List<Favorite>> GetByUserIdAsync(Guid userId)
    {
        return await _context.Favorites
            .Include(f => f.Product)
                .ThenInclude(p => p.Images)
            .Where(f => f.UserId == userId)
            .OrderByDescending(f => f.CreatedDate)
            .ToListAsync();
    }

    public async Task AddAsync(Favorite favorite)
    {
        await _context.Favorites.AddAsync(favorite);
    }

    public async Task RemoveAsync(Favorite favorite)
    {
        _context.Favorites.Remove(favorite);
        await Task.CompletedTask;
    }
}