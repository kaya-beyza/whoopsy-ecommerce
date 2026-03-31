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
       //docker bağlantısı için optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=MiniETicaretDb;Username=postgres;Password=postgres123");
        optionsBuilder.UseNpgsql("Host=ep-empty-dust-a9nzfxmr-pooler.gwc.azure.neon.tech;Port=5432;Database=neondb;Username=neondb_owner;Password=npg_ng5P3yBCOilf ;SSL Mode=Require;Trust Server Certificate=true");
        return new MiniETicaretDbContext(optionsBuilder.Options);
    }
}