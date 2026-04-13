using MiniETicaret.Domain.Entities;
using MiniETicaret.Domain.Enums;

namespace MiniETicaret.Application.Interfaces;

public interface IProductRepository
{
    Task<List<Product>> GetAllAsync(CancellationToken cancellationToken, int? page = null, int? pageSize = null);
    Task<Product?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task AddAsync(Product product, CancellationToken cancellationToken);
    Task UpdateAsync(Product product, CancellationToken cancellationToken);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken);
    Task<List<Product>> GetByCategoryIdAsync(Guid categoryId, CancellationToken cancellationToken, int? page = null, int? pageSize = null);
    Task<List<Product>> GetByGenderAsync(Gender? gender, Guid? categoryId, CancellationToken cancellationToken, int? page = null, int? pageSize = null);
    Task<List<Product>> GetByBrandAsync(Brand brand, CancellationToken cancellationToken, int? page = null, int? pageSize = null);
    Task<List<Product>> GetByFilterAsync(Gender? gender, Brand? brand, Guid? categoryId, string? searchTerm, CancellationToken cancellationToken, int? page = null, int? pageSize = null);
    // Image metodları
    Task<ProductImage> AddImageAsync(Guid productId, ProductImage image, CancellationToken cancellationToken);
    Task<bool> DeleteImageAsync(Guid productId, Guid imageId, CancellationToken cancellationToken);
    Task<List<ProductImage>> GetImagesByProductIdAsync(Guid productId, CancellationToken cancellationToken);
    Task<bool> SetMainImageAsync(Guid productId, Guid imageId, CancellationToken cancellationToken);
    
}