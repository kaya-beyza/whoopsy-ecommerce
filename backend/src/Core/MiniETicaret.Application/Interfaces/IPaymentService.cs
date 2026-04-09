namespace MiniETicaret.Application.Interfaces;

// iyzico'ya gönderilecek ödeme isteği
public class PaymentRequest
{
    // Sipariş bilgileri
    public Guid OrderId { get; set; }
    public decimal Price { get; set; }

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
    public string BuyerIp { get; set; } = string.Empty;
}

// iyzico'dan dönen ödeme sonucu
public class PaymentResponse
{
    public bool IsSuccess { get; set; }
    public string? PaymentId { get; set; }          // iyzico'nun verdiği ödeme ID'si
    public string ConversationId { get; set; } = string.Empty;  // Bizim takip numramız
    public string? CardLastFourDigits { get; set; }  
    public string? ErrorMessage { get; set; }
}

// Ödeme servisi sözleşmesi
public interface IPaymentService
{
    Task<PaymentResponse> CreatePaymentAsync(PaymentRequest request);
}