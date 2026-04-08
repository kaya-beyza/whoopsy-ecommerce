using Microsoft.EntityFrameworkCore;
  using Microsoft.EntityFrameworkCore.Metadata.Builders;
  using MiniETicaret.Domain.Entities;

  namespace MiniETicaret.Persistence.Configurations;

  public class ProductImageConfiguration : IEntityTypeConfiguration<ProductImage>
  {
      public void Configure(EntityTypeBuilder<ProductImage> builder)
      {
          builder.ToTable("ProductImages");
          builder.HasKey(pi => pi.Id);

          builder.Property(pi => pi.PublicId)
              .IsRequired()
              .HasMaxLength(300);

          builder.Property(pi => pi.Url)
              .IsRequired()
              .HasMaxLength(500);

          builder.Property(pi => pi.IsMain)
              .HasDefaultValue(false);

          builder.Property(pi => pi.DisplayOrder)
              .HasDefaultValue(0);

          builder.HasOne(pi => pi.Product)
              .WithMany(p => p.Images)
              .HasForeignKey(pi => pi.ProductId)
              .OnDelete(DeleteBehavior.Cascade);
      }
  }