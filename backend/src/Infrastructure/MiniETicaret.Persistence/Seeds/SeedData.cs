using Microsoft.EntityFrameworkCore;
using MiniETicaret.Domain.Entities;
using MiniETicaret.Persistence.Context;

namespace MiniETicaret.Persistence.Seeds;

public static class SeedData
{
    public static async Task SeedAsync(MiniETicaretDbContext context)
    {
        // Zaten rol varsa tekrar ekleme. Bu çok önemli — yoksa her çalıştırmada yeni roller eklenir
        if (await context.Roles.AnyAsync())
            return;

        var adminRole = new Role
        {
            Id = Guid.NewGuid(),
            Name = "Admin",
            Description = "Full access to all features",
            CreatedDate = DateTime.UtcNow
        };

        var userRole = new Role
        {
            Id = Guid.NewGuid(),
            Name = "User",
            Description = "Standard user with limited access",
            CreatedDate = DateTime.UtcNow
        };

        // İkisini birden ekle
        await context.Roles.AddRangeAsync(adminRole, userRole);
        await context.SaveChangesAsync();
    }
}