using Microsoft.EntityFrameworkCore;
using MiniETicaret.Domain.Entities;
namespace MiniETicaret.Persistence.Context;

public class MiniETicaretDbContext : DbContext
{
    public MiniETicaretDbContext(DbContextOptions<MiniETicaretDbContext> options) : base(options) //DbContextOptions  │ Bağlantı string'i, veritabanı tipi (PostgreSQL) gibi ayarlar dışarıdan enjekte edilecek
    {
    }
    public DbSet<AppUser> Users { get; set; }  // "Veritabanında Users adında bir tablo olacak ve her satır bir AppUser" demek  
    public DbSet<Role> Roles { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(MiniETicaretDbContext).Assembly);
    }
}