using System.Globalization;
using Iyzipay;
using Iyzipay.Model;
using Iyzipay.Request;
using Microsoft.Extensions.Configuration;
using MiniETicaret.Application.Interfaces;

namespace MiniETicaret.Infrastructure.Services;

public class IyzicoPaymentService : IPaymentService
{
    private readonly Options _options;

    public IyzicoPaymentService(IConfiguration configuration)
    {
        _options = new Options
        {
            ApiKey = configuration["Iyzico:ApiKey"],
            SecretKey = configuration["Iyzico:SecretKey"],
            BaseUrl = configuration["Iyzico:BaseUrl"]
        };
    }

    public async Task<PaymentResponse> CreatePaymentAsync(PaymentRequest request)
    {
        // 1) Ödeme isteğini hazırla
        var createPaymentRequest = new CreatePaymentRequest
        {
            Locale = Locale.TR.ToString(),
            ConversationId = request.OrderId.ToString(),
            Price = request.Price.ToString("F2", CultureInfo.InvariantCulture),
            PaidPrice = request.Price.ToString("F2", CultureInfo.InvariantCulture),
            Currency = Currency.TRY.ToString(),
            Installment = 1,
            PaymentChannel = PaymentChannel.WEB.ToString(),
            PaymentGroup = PaymentGroup.PRODUCT.ToString()
        };

        // 2) Kart bilgilerini ekle
        var paymentCard = new PaymentCard
        {
            CardHolderName = request.CardHolderName,
            CardNumber = request.CardNumber,
            ExpireMonth = request.ExpireMonth,
            ExpireYear = request.ExpireYear,
            Cvc = request.Cvc,
            RegisterCard = 0
        };
        createPaymentRequest.PaymentCard = paymentCard;

        // 3) Alıcı bilgilerini ekle
        var buyer = new Buyer
        {
            Id = request.OrderId.ToString(),
            Name = request.BuyerName,
            Surname = request.BuyerSurname,
            Email = request.BuyerEmail,
            GsmNumber = request.BuyerPhone,
            IdentityNumber = "74300864791", // iyzico sandbox test kimlik no
            RegistrationAddress = request.BuyerAddress,
            City = request.BuyerCity,
            Country = "Turkey",
            Ip = request.BuyerIp
        };
        createPaymentRequest.Buyer = buyer;

        // 4) Fatura ve teslimat adresini ekle
        var address = new Address
        {
            ContactName = $"{request.BuyerName} {request.BuyerSurname}",
            City = request.BuyerCity,
            Country = "Turkey",
            Description = request.BuyerAddress
        };
        createPaymentRequest.BillingAddress = address;
        createPaymentRequest.ShippingAddress = address;

        // 5) Sepet ürünlerini ekle
        var basketItems = new List<BasketItem>
          {
              new BasketItem
              {
                  Id = request.OrderId.ToString(),
                  Name = "Sipariş Ödemesi",
                  Category1 = "Genel",
                  ItemType = BasketItemType.PHYSICAL.ToString(),
                  Price = request.Price.ToString("F2", CultureInfo.InvariantCulture)
              }
          };
        createPaymentRequest.BasketItems = basketItems;

        // 6) iyzico API'sine gönder
          var payment = await Iyzipay.Model.Payment.Create(createPaymentRequest, _options);

        // 7) Sonucu dön
        return new PaymentResponse
        {
            IsSuccess = payment.Status == "success",
            PaymentId = payment.PaymentId,
            ConversationId = payment.ConversationId ?? request.OrderId.ToString(),
            CardLastFourDigits = payment.BinNumber != null
                ? request.CardNumber[^4..]
                : "0000",
            ErrorMessage = payment.ErrorMessage
        };
    }
}