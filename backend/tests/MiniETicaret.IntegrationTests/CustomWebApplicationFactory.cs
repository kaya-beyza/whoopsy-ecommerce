using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MiniETicaret.Persistence.Context;
using MiniETicaret.Persistence.Seeds;

namespace MiniETicaret.IntegrationTests;

public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    // Veritabanı adı BURADA üretiliyor — lambda dışında, bir kere
    // Böylece tüm istekler AYNI veritabanını kullanır
    private readonly string _dbName = "TestDb_" + Guid.NewGuid().ToString();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureAppConfiguration((context, config) =>
        {
            config.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:SecretKey"] = "TestOrtamiIcinCokGizliBirAnahtarEnAz32Karakter!",
                ["Jwt:Issuer"] = "MiniETicaret.API",
                ["Jwt:Audience"] = "MiniETicaret.Client",
                ["Jwt:ExpiresInMinutes"] = "15"
            });
        });

        builder.ConfigureServices(services =>
        {
            // 1) DbContext ve Npgsql ile ilgili TÜM kayıtları kaldır
            var descriptorsToRemove = services
                .Where(d => d.ServiceType.FullName!.Contains("DbContext") ||
                            d.ServiceType.FullName!.Contains("Npgsql"))
                .ToList();

            foreach (var descriptor in descriptorsToRemove)
                services.Remove(descriptor);

            // 2) Yerine InMemory Database koy — _dbName sabit, her istek aynı DB'ye gider
            services.AddDbContext<MiniETicaretDbContext>(options =>
            {
                options.UseInMemoryDatabase(_dbName);
            });

            // 3) Seed data'yı çalıştır (Admin/User rolleri)
            var sp = services.BuildServiceProvider();
            using var scope = sp.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<MiniETicaretDbContext>();
            context.Database.EnsureCreated();
            SeedData.SeedAsync(context).Wait();
        });
    }
}