using Microsoft.EntityFrameworkCore;
using MiniETicaret.Domain.Entities;
using MiniETicaret.Domain.Enums;
using MiniETicaret.Persistence.Context;

namespace MiniETicaret.Persistence.Seeds;

public static class SeedData
{
    // Sabit GUID'ler — her ortamda aynı olacak
    public static readonly Guid AdminRoleId = Guid.Parse("11111111-1111-1111-1111-111111111111");
    public static readonly Guid UserRoleId = Guid.Parse("22222222-2222-2222-2222-222222222222");

    // Kurucu admin — sistemin ilk admin'i, başvurusuz onaylı.
    // Email + şifre .env'den (BootstrapAdmin__Email / BootstrapAdmin__Password) okunur.
    // İkisinden biri boşsa bootstrap admin oluşturulmaz (development safety).
    public static readonly Guid BootstrapAdminId = Guid.Parse("33333333-3333-3333-3333-333333333333");

    public static async Task SeedAsync(MiniETicaretDbContext context, string? bootstrapAdminEmail = null, string? bootstrapAdminPassword = null)
    {
        await OrganizeCategoriesAsync(context);

        await SeedRolesAsync(context);
        await SeedBootstrapAdminAsync(context, bootstrapAdminEmail, bootstrapAdminPassword);
    }

    private static async Task SeedRolesAsync(MiniETicaretDbContext context)
    {
        if (await context.Roles.AnyAsync())
            return;

        var adminRole = new Role
        {
            Id = AdminRoleId,
            Name = "Admin",
            Description = "Full access to all features",
            CreatedDate = DateTime.UtcNow
        };

        var userRole = new Role
        {
            Id = UserRoleId,
            Name = "User",
            Description = "Standard user with limited access",
            CreatedDate = DateTime.UtcNow
        };

        await context.Roles.AddRangeAsync(adminRole, userRole);
        await context.SaveChangesAsync();
    }

    // Kurucu admin yoksa ekler. Approval flow'unu bypass eder: IsApproved=true, ApprovalStatus=Approved.
    // Sayesinde ilk admin login olabilir ve diğer başvuruları onaylayabilir.
    // .env'de credentials tanımlı değilse atlar (test/integration için).
    private static async Task SeedBootstrapAdminAsync(MiniETicaretDbContext context, string? email, string? password)
    {
        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
            return;

        var existing = await context.Users.AnyAsync(u => u.Id == BootstrapAdminId);
        if (existing)
            return;

        var bootstrapAdmin = new AppUser
        {
            Id = BootstrapAdminId,
            FullName = "Kurucu Admin",
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
            IsActive = true,
            IsApproved = true,
            ApprovalStatus = AdminApprovalStatus.Approved,
            RoleId = AdminRoleId,
            CreatedDate = DateTime.UtcNow
        };

        await context.Users.AddAsync(bootstrapAdmin);
        await context.SaveChangesAsync();
    }

    private static async Task OrganizeCategoriesAsync(MiniETicaretDbContext context)
    {
        var allCategories = await context.Categories.ToListAsync();

        var giyim = allCategories.FirstOrDefault(c => c.Name == "Giyim");
        var ayakkabi = allCategories.FirstOrDefault(c => c.Name == "Ayakkabi");
        var aksesuar = allCategories.FirstOrDefault(c => c.Name == "Aksesuar");

        if (giyim == null || ayakkabi == null || aksesuar == null) return;

        // 🛡️ Whomopsy Elite: Giyim Alt Kategorileri
        var giyimSubs = new[] { "Pantolon", "Tayt", "Esofman Ustu", "Etek", "Esofman Alti", "Ceket", "Mont", "Sweatshirt", "Sort", "Esofman Takimi", "Hoodie", "T-Shirt", "Elbise", "Forma" };

        // 🛡️ Whomopsy Elite: Ayakkabı Alt Kategorileri
        var ayakkabiSubs = new[] { "Bot", "Babet", "Sneaker", "Sandalet" };

        // 🛡️ Whomopsy Elite: Aksesuar Alt Kategorileri
        var aksesuarSubs = new[] { "Bere", "Suluk", "Canta", "Sapka", "Basketbol Topu" };

        foreach (var cat in allCategories)
        {
            if (giyimSubs.Contains(cat.Name)) cat.ParentId = giyim.Id;
            else if (ayakkabiSubs.Contains(cat.Name)) cat.ParentId = ayakkabi.Id;
            else if (aksesuarSubs.Contains(cat.Name)) cat.ParentId = aksesuar.Id;
        }

        await context.SaveChangesAsync();
    }
}
