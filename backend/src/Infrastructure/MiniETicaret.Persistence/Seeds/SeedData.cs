using Microsoft.EntityFrameworkCore;
  using MiniETicaret.Domain.Entities;
  using MiniETicaret.Persistence.Context;

  namespace MiniETicaret.Persistence.Seeds;

  public static class SeedData
  {
      // Sabit GUID'ler — her ortamda aynı olacak
      public static readonly Guid AdminRoleId = Guid.Parse("11111111-1111-1111-1111-111111111111");
      public static readonly Guid UserRoleId = Guid.Parse("22222222-2222-2222-2222-222222222222");

      public static async Task SeedAsync(MiniETicaretDbContext context)
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
  }