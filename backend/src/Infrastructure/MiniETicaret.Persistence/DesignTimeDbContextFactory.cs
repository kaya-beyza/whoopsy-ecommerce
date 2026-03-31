using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using MiniETicaret.Persistence.Context;

namespace MiniETicaret.Persistence;

/// EF Core CLI araçları (dotnet ef migrations) bu sınıfı kullanır.
/// Uygulamayı başlatmadan DbContext oluşturmasını sağlar.
public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<MiniETicaretDbContext>
{
    public MiniETicaretDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<MiniETicaretDbContext>();
        optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=MiniETicaretDb;Username=postgres;Password=postgres123");

        return new MiniETicaretDbContext(optionsBuilder.Options);
    }
}