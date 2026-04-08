using MiniETicaret.Domain.Entities;

namespace MiniETicaret.Application.Interfaces;

public interface IProductRepository
{
    Task<List<Product>> GetAllAsync(CancellationToken cancellationToken);
    Task<Product?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task AddAsync(Product product, CancellationToken cancellationToken);
    Task UpdateAsync(Product product, CancellationToken cancellationToken);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken);
    Task<List<Product>> GetByCategoryIdAsync(Guid categoryId, CancellationToken cancellationToken);
    // Image metodları
    Task<ProductImage> AddImageAsync(Guid productId, ProductImage image, CancellationToken cancellationToken);
    Task<bool> DeleteImageAsync(Guid productId, Guid imageId, CancellationToken cancellationToken);
    Task<List<ProductImage>> GetImagesByProductIdAsync(Guid productId, CancellationToken cancellationToken);
    Task<bool> SetMainImageAsync(Guid productId, Guid imageId, CancellationToken cancellationToken);
}