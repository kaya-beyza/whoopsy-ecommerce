using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MiniETicaret.Domain.Entities;

namespace MiniETicaret.Persistence.Configurations;

public class CategoryConfiguration : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.ToTable("Categories");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.HasIndex(c =>new{c.Name,c.ParentId})
            .IsUnique();

        builder.Property(c => c.Description)
            .HasMaxLength(500);

        builder.Property(c => c.IsActive)
            .HasDefaultValue(true);

        //Self-referencing:Kategori => Alt Kategoriler İlişkisi
        builder.HasOne(c=>c.ParentCategory)
        .WithMany(c=>c.SubCategories)
        .HasForeignKey(c=>c.ParentId)
        .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(c => c.Products)
            .WithOne(p => p.Category)
            .HasForeignKey(p => p.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}