using Microsoft.EntityFrameworkCore;
using MiniETicaret.Application.Interfaces;
using MiniETicaret.Domain.Entities;
using MiniETicaret.Persistence.Context;

namespace MiniETicaret.Persistence.Repositories;

public class CategoryRepository : ICategoryRepository
{
    private readonly MiniETicaretDbContext _context;

    public CategoryRepository(MiniETicaretDbContext context)
    {
        _context = context;
    }

    public async Task<List<Category>> GetAllAsync(CancellationToken cancellationToken)
    {
        return await _context.Categories.ToListAsync(cancellationToken);
    }  

    public async Task<Category?> GetByIdAsync(Guid id , CancellationToken cancellationToken)
    {
        return await _context.Categories.FindAsync(new object[] { id }, cancellationToken); // new object[] { id } ekleyerek FindAsync'ye parametre geçiyorr
    }

    public async Task AddAsync(Category category, CancellationToken cancellationToken)
    {
        await _context.Categories.AddAsync(category,cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(Category category, CancellationToken cancellationToken)
    {
        _context.Categories.Update(category);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var category = await GetByIdAsync(id, cancellationToken);
        if(category != null)
        {
            _context.Categories.Remove(category);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }



}