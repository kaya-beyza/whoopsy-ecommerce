using FluentValidation.TestHelper;
using MiniETicaret.Application.Features.Orders.Commands.UpdateOrderStatus;
using MiniETicaret.Domain.Enums;

namespace MiniETicaret.UnitTests.Features.Orders.CommandsTest;

public class UpdateOrderStatusCommandValidatorTests
{
    private readonly UpdateOrderStatusCommandValidator _validator;

    public UpdateOrderStatusCommandValidatorTests()
    {
        _validator = new UpdateOrderStatusCommandValidator();
    }

    // ══════════════════════════════════════════
    // TEST 1: Geçerli command hatasız geçmeli
    // ══════════════════════════════════════════
    [Fact]
    public void Validate_ValidCommand_ShouldPassValidation()
    {
        var command = new UpdateOrderStatusCommand
        {
            OrderId = Guid.NewGuid(),
            NewStatus = OrderStatus.Confirmed
        };

        var result = _validator.TestValidate(command);
        result.ShouldNotHaveAnyValidationErrors();
    }

    // ══════════════════════════════════════════
    // TEST 2: OrderId boşsa hata vermeli
    // ══════════════════════════════════════════
    [Fact]
    public void Validate_EmptyOrderId_ShouldHaveError()
    {
        var command = new UpdateOrderStatusCommand
        {
            OrderId = Guid.Empty,
            NewStatus = OrderStatus.Shipped
        };

        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.OrderId);
    }

    // ══════════════════════════════════════════
    // TEST 3: Geçersiz enum değeri hata vermeli
    // ══════════════════════════════════════════
    [Fact]
    public void Validate_InvalidStatus_ShouldHaveError()
    {
        var command = new UpdateOrderStatusCommand
        {
            OrderId = Guid.NewGuid(),
            NewStatus = (OrderStatus)99  // enum'da olmayan değer
        };

        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.NewStatus);
    }
}