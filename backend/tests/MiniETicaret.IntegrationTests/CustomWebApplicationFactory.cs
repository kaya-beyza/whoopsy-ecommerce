using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using MiniETicaret.Persistence.Context;
using MiniETicaret.Persistence.Seeds;

namespace MiniETicaret.IntegrationTests;

public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            // 1) Gerçek PostgreSQL DbContext kaydını bul ve kaldır
            var descriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<MiniETicaretDbContext>));

            if (descriptor != null)
                services.Remove(descriptor);

            // 2) Yerine InMemory Database koy
            services.AddDbContext<MiniETicaretDbContext>(options =>
            {
                options.UseInMemoryDatabase("TestDb_" + Guid.NewGuid().ToString());
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