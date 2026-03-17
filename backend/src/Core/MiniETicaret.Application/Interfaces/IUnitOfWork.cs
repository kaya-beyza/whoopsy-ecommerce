namespace MiniETicaret.Application.Interfaces;

public interface IUnitOfWork : IDisposable
{
    Task<int> SaveChangesAsync(); // Biriken tüm değişiklikleri veritabanına tek seferde kaydeder. Dönen int kaç satırın etkilendiğini söyler. 
}