using MiniETicaret.Domain.Enums;

namespace MiniETicaret.Application.DTOs;

public class PaymentDto
{
    public Guid Id { get; set; }
    public Guid OrderId { get; set; }
    public decimal Amount { get; set; }
    public PaymentStatus Status { get; set; }
    public string CardHolderName { get; set; } = string.Empty;
    public string CardLastFourDigits { get; set; } = string.Empty;
    public DateTime? PaidAt { get; set; }
    public string? ErrorMessage { get; set; }
}