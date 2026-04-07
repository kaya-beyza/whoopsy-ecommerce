using Microsoft.EntityFrameworkCore;
using MiniETicaret.Application.Interfaces;
using MiniETicaret.Domain.Entities;
using MiniETicaret.Persistence.Context;

namespace MiniETicaret.Persistence.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly MiniETicaretDbContext _context;

    public ProductRepository(MiniETicaretDbContext context)
    {
        _context = context;
    }

    public async Task<List<Product>> GetAllAsync(CancellationToken cancellationToken)
    {
        return await _context.Products.ToListAsync(cancellationToken);
    }
           
    public async Task<Product?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await _context.Products.FindAsync(new object[] { id }, cancellationToken);
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
    public async Task<List<Product>> GetByCategoryIdAsync(Guid categoryId, CancellationToken cancellationToken)
    {   
    return await _context.Products
        .Where(p => p.CategoryId == categoryId)
        .ToListAsync(cancellationToken);
    }
}