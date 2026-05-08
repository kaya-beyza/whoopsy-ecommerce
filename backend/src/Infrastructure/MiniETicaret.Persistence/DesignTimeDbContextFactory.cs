using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using MiniETicaret.Persistence.Context;

namespace MiniETicaret.Persistence;

/// EF Core CLI araçları (dotnet ef migrations) bu sınıfı kullanır.
/// Connection string'i API projesinin .env dosyasından okur.
public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<MiniETicaretDbContext>
{
    public MiniETicaretDbContext CreateDbContext(string[] args)
    {
        var apiProjectPath = Path.GetFullPath(Path.Combine(
            AppContext.BaseDirectory,
            "..", "..", "..", "..", "..",
            "Presentation", "MiniETicaret.API"));

        DotNetEnv.Env.Load(Path.Combine(apiProjectPath, ".env"));

        var configuration = new ConfigurationBuilder()
            .SetBasePath(apiProjectPath)
            .AddJsonFile("appsettings.json", optional: false)
            .AddEnvironmentVariables()
            .Build();

        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException(
                "ConnectionStrings:DefaultConnection bulunamadı. " +
                "API projesinde .env dosyası oluşturun ve " +
                "ConnectionStrings__DefaultConnection değerini set edin (.env.example'a bakın).");

        var optionsBuilder = new DbContextOptionsBuilder<MiniETicaretDbContext>();
        optionsBuilder.UseNpgsql(connectionString);
        return new MiniETicaretDbContext(optionsBuilder.Options);
    }
}
