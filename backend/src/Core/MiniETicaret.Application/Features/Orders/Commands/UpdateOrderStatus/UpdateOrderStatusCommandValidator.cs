using FluentValidation;

namespace MiniETicaret.Application.Features.Orders.Commands.UpdateOrderStatus;

public class UpdateOrderStatusCommandValidator : AbstractValidator<UpdateOrderStatusCommand>
{
    public UpdateOrderStatusCommandValidator()
    {
        RuleFor(x => x.OrderId)
            .NotEmpty().WithMessage("Sipariş Id boş olamaz!");

        RuleFor(x => x.NewStatus)
            .IsInEnum().WithMessage("Geçersiz sipariş durumu!");
    }
}