using Microsoft.EntityFrameworkCore;
  using Microsoft.EntityFrameworkCore.Metadata.Builders;
  using MiniETicaret.Domain.Entities;

  namespace MiniETicaret.Persistence.Configurations;

  public class OrderConfiguration : IEntityTypeConfiguration<Order>
  {
      public void Configure(EntityTypeBuilder<Order> builder)
      {
          builder.ToTable("Orders");

          builder.HasKey(o => o.Id);

          builder.Property(o => o.TotalAmount)
              .IsRequired()
              .HasColumnType("decimal(18,2)");

          builder.Property(o => o.Status)
              .IsRequired();

          builder.Property(o => o.ShippingAddress)
              .IsRequired()
              .HasMaxLength(500);

          builder.HasOne(o => o.User)
              .WithMany(u => u.Orders)
              .HasForeignKey(o => o.UserId)
              .OnDelete(DeleteBehavior.Restrict);

          builder.HasMany(o => o.OrderItems)
              .WithOne(oi => oi.Order)
              .HasForeignKey(oi => oi.OrderId)
              .OnDelete(DeleteBehavior.Cascade);
      }
  }