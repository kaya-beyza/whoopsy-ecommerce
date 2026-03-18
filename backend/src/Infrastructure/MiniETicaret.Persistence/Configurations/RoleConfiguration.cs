using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MiniETicaret.Domain.Entities;

namespace MiniETicaret.Persistence.Configurations;

public class RoleConfiguration : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        builder.ToTable("Roles");
        builder.HasKey(r => r.Id); // Primary Key :Id

        builder.Property(r => r.Name)
            .IsRequired()
            .HasMaxLength(50);
        builder.HasIndex(r => r.Name) // Aynı isimde iki rol olamaz. İki tane "Admin" rolü olması saçma olur
            .IsUnique();

        builder.Property(r => r.Description)
            .HasMaxLength(200);
    }
}