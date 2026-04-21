using Microsoft.EntityFrameworkCore;
using MiniETicaret.Application.Interfaces;
using MiniETicaret.Domain.Entities;
using MiniETicaret.Persistence.Context;

namespace MiniETicaret.Persistence.Repositories;

public class CartRepository : ICartRepository
{
    private readonly MiniETicaretDbContext _context;

    public CartRepository(MiniETicaretDbContext context)
    {
        _context = context;
    }

    public async Task<CartItem?> GetAsync(Guid userId, Guid productId)
    {
        return await _context.CartItems
            .FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == productId);
    }

    public async Task<List<CartItem>> GetByUserIdAsync(Guid userId)
    {
        return await _context.CartItems
            .Include(c => c.Product)
                .ThenInclude(p => p.Images)
            .Where(c => c.UserId == userId)
            .OrderByDescending(c => c.CreatedDate)
            .ToListAsync();
    }

    public async Task AddAsync(CartItem cartItem)
    {
        await _context.CartItems.AddAsync(cartItem);
    }

    public async Task UpdateAsync(CartItem cartItem)
    {
        _context.CartItems.Update(cartItem);
        await Task.CompletedTask;
    }

    public async Task RemoveAsync(CartItem cartItem)
    {
        _context.CartItems.Remove(cartItem);
        await Task.CompletedTask;
    }

    public async Task ClearByUserIdAsync(Guid userId)
    {
        var items = await _context.CartItems
            .Where(c => c.UserId == userId)
            .ToListAsync();

        _context.CartItems.RemoveRange(items);
    }
}