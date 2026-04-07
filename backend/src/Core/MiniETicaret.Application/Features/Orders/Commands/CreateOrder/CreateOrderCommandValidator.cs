using FluentValidation;

  namespace MiniETicaret.Application.Features.Orders.Commands.CreateOrder;

  public class CreateOrderCommandValidator : AbstractValidator<CreateOrderCommand>
  {
      public CreateOrderCommandValidator()
      {
          RuleFor(x => x.UserId)
              .NotEmpty().WithMessage("Kullanıcı Id boş olamaz!");

          RuleFor(x => x.ShippingAddress)
              .NotEmpty().WithMessage("Kargo adresi boş olamaz!")
              .MaximumLength(500).WithMessage("Kargo adresi 500 karakterden uzun olamaz!");

          RuleFor(x => x.OrderItems)
              .NotEmpty().WithMessage("Sipariş en az bir ürün içermelidir!");

          RuleForEach(x => x.OrderItems).ChildRules(item =>
          {
              item.RuleFor(i => i.ProductId)
                  .NotEmpty().WithMessage("Ürün Id boş olamaz!");

              item.RuleFor(i => i.Quantity)
                  .GreaterThan(0).WithMessage("Ürün adedi sıfırdan büyük olmalıdır!");

              item.RuleFor(i => i.UnitPrice)
                  .GreaterThan(0).WithMessage("Birim fiyat sıfırdan büyük olmalıdır!");
          });
      }
  }