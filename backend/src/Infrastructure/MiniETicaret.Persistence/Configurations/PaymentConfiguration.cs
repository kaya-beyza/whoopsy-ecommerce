using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MiniETicaret.Domain.Entities;

namespace MiniETicaret.Persistence.Configurations;

public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
{
    public void Configure(EntityTypeBuilder<Payment> builder)
    {
        builder.ToTable("Payments");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Amount)
            .IsRequired()
            .HasColumnType("decimal(18,2)");

        builder.Property(p => p.Status)
            .IsRequired();

        builder.Property(p => p.IyzicoPaymentId)
            .HasMaxLength(100);

        builder.Property(p => p.ConversationId)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(p => p.CardHolderName)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(p => p.CardLastFourDigits)
            .IsRequired()
            .HasMaxLength(4);

        // Order ile bire-bir ilişki
        builder.HasOne(p => p.Order)
            .WithOne(o => o.Payment)
            .HasForeignKey<Payment>(p => p.OrderId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}