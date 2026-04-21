using MiniETicaret.Domain.Entities;

namespace MiniETicaret.Application.Interfaces;

public interface ICartRepository
{
    Task<CartItem?> GetAsync(Guid userId, Guid productId);
    Task<List<CartItem>> GetByUserIdAsync(Guid userId);
    Task AddAsync(CartItem cartItem);
    Task UpdateAsync(CartItem cartItem);
    Task RemoveAsync(CartItem cartItem);
    Task ClearByUserIdAsync(Guid userId);
}