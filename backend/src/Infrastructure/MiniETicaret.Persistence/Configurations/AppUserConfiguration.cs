using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MiniETicaret.Domain.Entities;

namespace MiniETicaret.Persistence.Configurations;

public class AppUserConfiguration : IEntityTypeConfiguration<AppUser>
{
    public void Configure(EntityTypeBuilder<AppUser> builder)
    {
        builder.ToTable("Users");

        builder.HasKey(u => u.Id);

        builder.Property(u => u.FullName)
          .IsRequired()
          .HasMaxLength(100);

        builder.Property(u => u.Email)
            .IsRequired()
            .HasMaxLength(150);

        builder.HasIndex(u => u.Email)
            .IsUnique();

        builder.Property(u => u.PasswordHash)
            .IsRequired();

        builder.Property(u => u.IsActive)
            .HasDefaultValue(true);

        builder.HasOne(u => u.Role) // Bir kullanıcının bir rolü var, bir rolün birçok kullanıcısı var
            .WithMany(r => r.Users)
            .HasForeignKey(u => u.RoleId)  // İlişkiyi RoleId sütunuyla kur 
            .OnDelete(DeleteBehavior.Restrict); //Rol silinirse, kullanıcıları olan rol silinemez 

        builder.HasMany(u => u.RefreshTokens)
            .WithOne(rt => rt.AppUser)
            .HasForeignKey(rt => rt.AppUserId)
            .OnDelete(DeleteBehavior.Cascade); //Kullanıcı silinirse, token'ları da otomatik silinir


    }
}