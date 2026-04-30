using Microsoft.EntityFrameworkCore;
using MiniETicaret.Application.Interfaces;
using MiniETicaret.Domain.Entities;
using MiniETicaret.Persistence.Context;
using MiniETicaret.Domain.Enums;

namespace MiniETicaret.Persistence.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly MiniETicaretDbContext _context;

    public ProductRepository(MiniETicaretDbContext context)
    {
        _context = context;
    }

    public async Task<(List<Product> Items, int TotalCount)> GetAllAsync(CancellationToken cancellationToken, int? page = null, int? pageSize = null)
    {
        var query = _context.Products.AsQueryable();
        var totalCount = await query.CountAsync(cancellationToken);

        if (page.HasValue && pageSize.HasValue)
        {
            query = query.Skip((page.Value - 1) * pageSize.Value).Take(pageSize.Value);
        }

        var items = await query
          .Include(p => p.Images)
          .ToListAsync(cancellationToken);

        return (items, totalCount);
    }

    public async Task<Product?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await _context.Products
          .Include(p => p.Images)
          .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
    }
    public async Task AddAsync(Product product, CancellationToken cancellationToken)
    {
        await _context.Products.AddAsync(product, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }
    public async Task UpdateAsync(Product product, CancellationToken cancellationToken)
    {
        _context.Products.Update(product);
        await _context.SaveChangesAsync(cancellationToken);
    }
    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var product = await GetByIdAsync(id, cancellationToken);
        if (product != null)
        {
            _context.Products.Remove(product);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
    public async Task<(List<Product> Items, int TotalCount)> GetByCategoryIdAsync(Guid categoryId, CancellationToken cancellationToken, int? page = null, int? pageSize = null)
    {
        var query = _context.Products.Where(p => p.CategoryId == categoryId);
        var totalCount = await query.CountAsync(cancellationToken);

        if (page.HasValue && pageSize.HasValue)
        {
            query = query.Skip((page.Value - 1) * pageSize.Value).Take(pageSize.Value);
        }

        var items = await query
            .Include(p => p.Images)
            .ToListAsync(cancellationToken);

        return (items, totalCount);
    }


    public async Task<ProductImage> AddImageAsync(Guid productId, ProductImage image, CancellationToken cancellationToken)
    {
        image.ProductId = productId;
        image.CreatedDate = DateTime.UtcNow.AddHours(3);

        await _context.ProductImages.AddAsync(image, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        return image;
    }

    public async Task<bool> DeleteImageAsync(Guid productId, Guid imageId, CancellationToken cancellationToken)
    {
        var image = await _context.ProductImages
            .FirstOrDefaultAsync(i => i.Id == imageId && i.ProductId == productId, cancellationToken);

        if (image == null)
            return false;

        _context.ProductImages.Remove(image);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }

    public async Task<List<ProductImage>> GetImagesByProductIdAsync(Guid productId, CancellationToken cancellationToken)
    {
        return await _context.ProductImages
            .Where(i => i.ProductId == productId)
            .OrderBy(i => i.DisplayOrder)
            .ToListAsync(cancellationToken);
    }
    public async Task<(List<Product> Items, int TotalCount)> GetByGenderAsync(Gender? gender, Guid? categoryId, CancellationToken cancellationToken, int? page = null, int? pageSize = null)
    {
        var query = _context.Products.AsQueryable();

        if (gender.HasValue)
            query = query.Where(p => p.Gender == gender.Value);

        if (categoryId.HasValue)
            query = query.Where(p => p.CategoryId == categoryId.Value);

        var totalCount = await query.CountAsync(cancellationToken);

        if (page.HasValue && pageSize.HasValue)
        {
            query = query.Skip((page.Value - 1) * pageSize.Value).Take(pageSize.Value);
        }

        var items = await query
                        .Include(p => p.Images)
                        .ToListAsync(cancellationToken);

        return (items, totalCount);
    }
    public async Task<(List<Product> Items, int TotalCount)> GetByBrandAsync(Brand brand, CancellationToken cancellationToken, int? page = null, int? pageSize = null)
    {
        var query = _context.Products.Where(p => p.Brand == brand);
        var totalCount = await query.CountAsync(cancellationToken);

        if (page.HasValue && pageSize.HasValue)
        {
            query = query.Skip((page.Value - 1) * pageSize.Value).Take(pageSize.Value);
        }

        var items = await query
            .Include(p => p.Images)
            .ToListAsync(cancellationToken);

        return (items, totalCount);
    }

    public async Task<(List<Product> Items, int TotalCount)> GetByFilterAsync(List<Gender>? genders, List<Brand>? brands, List<Guid>? categoryIds, string? searchTerm, CancellationToken cancellationToken, int? page = null, int? pageSize = null)
    {
        var query = _context.Products.AsQueryable();

        if (genders != null && genders.Any())
            query = query.Where(p => genders.Contains(p.Gender));

        if (brands != null && brands.Any())
            query = query.Where(p => brands.Contains(p.Brand));

        if (categoryIds != null && categoryIds.Any())
        {
            // Whomopsy Elite: Akıllı Kategori Budama Mührü (Smart Pruning) 🛡️
            var allCats = await _context.Categories.AsNoTracking().ToListAsync(cancellationToken);
            var selectedCats = allCats.Where(c => categoryIds.Contains(c.Id)).ToList();
            
            // Eğer bir kategorinin çocuğu da listedeyse, o kategoriyi (Parent) listeden çıkarıyoruz. 
            // Bu sayede "Ayakkabı + Sneaker" seçildiğinde sistem sadece "Sneaker"ı baz alıp daraltma yapar.
            var parentIdsToRemove = selectedCats
                .Where(c => c.ParentId != null && categoryIds.Contains(c.ParentId.Value))
                .Select(c => c.ParentId.Value)
                .Distinct()
                .ToList();

            var prunedIds = categoryIds.Where(id => !parentIdsToRemove.Contains(id)).ToList();

            // Budanmış liste üzerinden hiyerarşik kapsama (Tüm altları dahil et)
            var finalCategoryIds = allCats
                .Where(c => prunedIds.Contains(c.Id) || (c.ParentId != null && prunedIds.Contains(c.ParentId.Value)))
                .Select(c => c.Id)
                .Distinct()
                .ToList();

            query = query.Where(p => finalCategoryIds.Contains(p.CategoryId));
        }

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var lowerSearch = searchTerm.ToLower();
            query = query.Where(p => p.Name.ToLower().Contains(lowerSearch) || 
                                    (p.Description != null && p.Description.ToLower().Contains(lowerSearch)));
        }

        var totalCount = await query.CountAsync(cancellationToken);

        if (page.HasValue && pageSize.HasValue)
        {
            query = query.Skip((page.Value - 1) * pageSize.Value).Take(pageSize.Value);
        }

        var items = await query
                    .Include(p => p.Images)
                    .ToListAsync(cancellationToken);

        return (items, totalCount);
    }
    public async Task<bool> SetMainImageAsync(Guid productId, Guid imageId, CancellationToken cancellationToken)
    {
        var images = await _context.ProductImages
            .Where(i => i.ProductId == productId)
            .ToListAsync(cancellationToken);

        var targetImage = images.FirstOrDefault(i => i.Id == imageId);
        if (targetImage == null)
            return false;

        // Tüm görsellerin IsMain'ini false yap
        foreach (var img in images)
        {
            img.IsMain = false;
        }

        // Seçilen görseli ana görsel yap
        targetImage.IsMain = true;

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
// ödeme ekranı firebasein sandbox 
//  bedeva storage sağlayan azure storeageoları oraya yüklenecek linkler gelicek 
// ürünler kaggle veri seti kaggledan veriler çekilecek.
// register adres, telefon numaras eklenecek 
//ödeme ekranı yapılacak 