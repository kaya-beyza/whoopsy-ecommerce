using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using MiniETicaret.Persistence.Context;

namespace MiniETicaret.Persistence;

/// EF Core CLI araçları (dotnet ef migrations) bu sınıfı kullanır.
/// Connection string'i API projesinin appsettings.json + user-secrets'ından okur.
public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<MiniETicaretDbContext>
{
    private const string ApiUserSecretsId = "0c51c28b-e7c4-4a0b-8e7a-0a080d13b480";

    public MiniETicaretDbContext CreateDbContext(string[] args)
    {
        var apiProjectPath = Path.GetFullPath(Path.Combine(
            AppContext.BaseDirectory,
            "..", "..", "..", "..", "..",
            "Presentation", "MiniETicaret.API"));

        var configuration = new ConfigurationBuilder()
            .SetBasePath(apiProjectPath)
            .AddJsonFile("appsettings.json", optional: false)
            .AddUserSecrets(ApiUserSecretsId)
            .Build();

        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException(
                "ConnectionStrings:DefaultConnection bulunamadı. " +
                "API projesinde 'dotnet user-secrets set ConnectionStrings:DefaultConnection \"...\"' çalıştırın.");

        var optionsBuilder = new DbContextOptionsBuilder<MiniETicaretDbContext>();
        optionsBuilder.UseNpgsql(connectionString);
        return new MiniETicaretDbContext(optionsBuilder.Options);
    }
}
