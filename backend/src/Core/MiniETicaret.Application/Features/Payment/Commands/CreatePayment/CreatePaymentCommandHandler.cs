using MediatR;
  using MiniETicaret.Application.DTOs;
  using MiniETicaret.Application.Interfaces;
  using MiniETicaret.Domain.Entities;
  using MiniETicaret.Domain.Enums;

  namespace MiniETicaret.Application.Features.Payments.Commands.CreatePayment;

  public class CreatePaymentCommandHandler : IRequestHandler<CreatePaymentCommand, PaymentDto>
  {
      private readonly IOrderRepository _orderRepository;
      private readonly IPaymentService _paymentService;
      private readonly IUnitOfWork _unitOfWork;

      public CreatePaymentCommandHandler(
          IOrderRepository orderRepository,
          IPaymentService paymentService,
          IUnitOfWork unitOfWork)
      {
          _orderRepository = orderRepository;
          _paymentService = paymentService;
          _unitOfWork = unitOfWork;
      }

      public async Task<PaymentDto> Handle(CreatePaymentCommand request, CancellationToken cancellationToken)
      {
          // 1) Siparişi bul
          var order = await _orderRepository.GetByIdWithDetailsAsync(request.OrderId);
          if (order == null)
              throw new Exception($"Sipariş bulunamadı: {request.OrderId}");

          // 2) Sipariş zaten başarıyla ödenmiş mi kontrol et
          if (order.Payment != null && order.Payment.Status == PaymentStatus.Success)
              throw new Exception("Bu sipariş zaten ödenmiş.");

          // 3) iyzico'ya gönderilecek ödeme isteğini hazırla
          var paymentRequest = new PaymentRequest
          {
              OrderId = order.Id,
              Price = order.TotalAmount,
              CardHolderName = request.CardHolderName,
              CardNumber = request.CardNumber,
              ExpireMonth = request.ExpireMonth,
              ExpireYear = request.ExpireYear,
              Cvc = request.Cvc,
              BuyerName = request.BuyerName,
              BuyerSurname = request.BuyerSurname,
              BuyerEmail = request.BuyerEmail,
              BuyerPhone = request.BuyerPhone,
              BuyerAddress = request.BuyerAddress,
              BuyerCity = request.BuyerCity,
              BuyerIp = "127.0.0.1"
          };

          // 4) iyzico'ya ödeme isteği gönder
          var paymentResponse = await _paymentService.CreatePaymentAsync(paymentRequest);

          // 5) Mevcut başarısız ödeme varsa güncelle, yoksa yeni oluştur
          Payment payment;
          if (order.Payment != null)
          {
              // Mevcut başarısız ödemeyi güncelle
              payment = order.Payment;
              payment.ConversationId = paymentResponse.ConversationId;
              payment.IyzicoPaymentId = paymentResponse.PaymentId;
              payment.CardHolderName = request.CardHolderName;
              payment.CardLastFourDigits = paymentResponse.CardLastFourDigits ?? "0000";
          }
          else
          {
              // Yeni ödeme oluştur
              payment = new Payment
              {
                  OrderId = order.Id,
                  Amount = order.TotalAmount,
                  ConversationId = paymentResponse.ConversationId,
                  IyzicoPaymentId = paymentResponse.PaymentId,
                  CardHolderName = request.CardHolderName,
                  CardLastFourDigits = paymentResponse.CardLastFourDigits ?? "0000",
                  CreatedDate = DateTime.UtcNow.AddHours(3)
              };
              order.Payment = payment;
          }

          // 6) Ödeme başarılıysa durumları güncelle
          if (paymentResponse.IsSuccess)
          {
              payment.Status = PaymentStatus.Success;
              payment.PaidAt = DateTime.UtcNow.AddHours(3);
              order.Status = OrderStatus.Confirmed;
          }
          else
          {
              payment.Status = PaymentStatus.Failed;
          }

          // 7) Veritabanına kaydet
          await _orderRepository.UpdateAsync(order);
          await _unitOfWork.SaveChangesAsync();

          // 8) Sonucu DTO olarak döndür
          return new PaymentDto
          {
              Id = payment.Id,
              OrderId = payment.OrderId,
              Amount = payment.Amount,
              Status = payment.Status,
              CardHolderName = payment.CardHolderName,
              CardLastFourDigits = payment.CardLastFourDigits,
              PaidAt = payment.PaidAt,
              ErrorMessage = paymentResponse.ErrorMessage
          };
      }
  }