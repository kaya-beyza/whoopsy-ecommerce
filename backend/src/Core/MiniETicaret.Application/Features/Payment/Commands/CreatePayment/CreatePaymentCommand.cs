using MediatR;
using MiniETicaret.Application.DTOs;

namespace MiniETicaret.Application.Features.Payments.Commands.CreatePayment;

public class CreatePaymentCommand : IRequest<PaymentDto>
{
    // Hangi sipariş için ödeme yapılacak?
    public Guid OrderId { get; set; }

    // Kart bilgileri
    public string CardHolderName { get; set; } = string.Empty;
    public string CardNumber { get; set; } = string.Empty;
    public string ExpireMonth { get; set; } = string.Empty;
    public string ExpireYear { get; set; } = string.Empty;
    public string Cvc { get; set; } = string.Empty;

    // Alıcı bilgileri
    public string BuyerName { get; set; } = string.Empty;
    public string BuyerSurname { get; set; } = string.Empty;
    public string BuyerEmail { get; set; } = string.Empty;
    public string BuyerPhone { get; set; } = string.Empty;
    public string BuyerAddress { get; set; } = string.Empty;
    public string BuyerCity { get; set; } = string.Empty;
}