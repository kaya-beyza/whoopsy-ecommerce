using MiniETicaret.Domain.Entities;

namespace MiniETicaret.Application.Interfaces;

public interface ICategoryRepository
{
    Task<List<Category>> GetAllAsync(CancellationToken cancellationToken);
    Task<Category?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task AddAsync(Category category, CancellationToken cancellationToken);
    Task UpdateAsync(Category category, CancellationToken cancellationToken);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken);
}