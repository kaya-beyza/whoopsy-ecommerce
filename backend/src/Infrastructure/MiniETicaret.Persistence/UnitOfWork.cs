using MiniETicaret.Application.Interfaces;
using MiniETicaret.Persistence.Context;
namespace MiniETicaret.Persistence;

public class UnitOfWork : IUnitOfWork
{
    private readonly MiniETicaretDbContext _context;

    public UnitOfWork(MiniETicaretDbContext context)
    {
        _context =context;
    }

    public async Task<int> SaveChangesAsync() //Kaç satır etkilendi. Örn: 2 kullanıcı eklendiyse 2 döner
    {
        return await _context.SaveChangesAsync(); //DbContext'te biriken tüm değişiklikleri (Add, Update, Delete) veritabanına tek seferde yazar
    }
    public void Dispose() //İş bitince veritabanı bağlantısını temizle, kaynakları serbest bırak. IDisposable interface'i bunu zorunlu kılıyor
    {
        _context.Dispose();
    }
}