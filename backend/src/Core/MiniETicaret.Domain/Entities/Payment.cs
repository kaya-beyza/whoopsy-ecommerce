using MiniETicaret.Domain.Common;
using MiniETicaret.Domain.Enums;

namespace MiniETicaret.Domain.Entities;

public class Payment : BaseEntity
{
    // Hangi siparişe ait bu ödeme?
    public Guid OrderId { get; set; }
    public Order Order { get; set; } = null!;

    // Ödeme tutarı (sipariş tutarıyla aynı olacak)
    public decimal Amount { get; set; }

    // Ödeme durumu (Pending, Success, Failed, Refunded)
    public PaymentStatus Status { get; set; } = PaymentStatus.Pending;

    // iyzico'dan dönen benzersiz ödeme ID'si
    public string? IyzicoPaymentId { get; set; }

    // iyzico'ya gönderdiğimiz konuşma ID'si (takip için)
    public string ConversationId { get; set; } = string.Empty;

    // Kart sahibinin adı (maskelenmiş olarak saklayacağız)
    public string CardHolderName { get; set; } = string.Empty;

    // Kartın son 4 hanesi (güvenlik için sadece son 4 hane)
    public string CardLastFourDigits { get; set; } = string.Empty;

    // Ödeme tarihi
    public DateTime? PaidAt { get; set; }
}