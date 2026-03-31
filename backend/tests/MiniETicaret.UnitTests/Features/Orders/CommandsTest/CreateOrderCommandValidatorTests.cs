using FluentValidation.TestHelper;
using MiniETicaret.Application.Features.Orders.Commands.CreateOrder;

namespace MiniETicaret.UnitTests.Features.Orders.CommandsTest;

public class CreateOrderCommandValidatorTests
{
    private readonly CreateOrderCommandValidator _validator;

    public CreateOrderCommandValidatorTests()
    {
        _validator = new CreateOrderCommandValidator();
    }

    // Testlerde tekrar tekrar geçerli command oluşturmamak için yardımcı metod
    private CreateOrderCommand CreateValidCommand() => new()
    {
        UserId = Guid.NewGuid(),
        ShippingAddress = "İstanbul, Kadıköy, Test Mah. No:1",
        OrderItems = new List<CreateOrderItemDto>
          {
              new() { ProductId = Guid.NewGuid(), Quantity = 2, UnitPrice = 100m }
          }
    };

    // ══════════════════════════════════════════
    // TEST 1: Geçerli command hatasız geçmeli
    // ══════════════════════════════════════════
    [Fact]
    public void Validate_ValidCommand_ShouldPassValidation()
    {
        var command = CreateValidCommand();
        var result = _validator.TestValidate(command);
        result.ShouldNotHaveAnyValidationErrors();
    }

    // ══════════════════════════════════════════
    // TEST 2: UserId boşsa hata vermeli
    // ══════════════════════════════════════════
    [Fact]
    public void Validate_EmptyUserId_ShouldHaveError()
    {
        var command = CreateValidCommand();
        command.UserId = Guid.Empty;

        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.UserId);
    }

    // ══════════════════════════════════════════
    // TEST 3: ShippingAddress boşsa hata vermeli
    // ══════════════════════════════════════════
    [Fact]
    public void Validate_EmptyShippingAddress_ShouldHaveError()
    {
        var command = CreateValidCommand();
        command.ShippingAddress = string.Empty;

        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.ShippingAddress);
    }

    // ══════════════════════════════════════════
    // TEST 4: ShippingAddress 500 karakterden uzunsa hata vermeli
    // ══════════════════════════════════════════
    [Fact]
    public void Validate_ShippingAddressTooLong_ShouldHaveError()
    {
        var command = CreateValidCommand();
        command.ShippingAddress = new string('A', 501); // 501 karakter

        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.ShippingAddress);
    }

    // ══════════════════════════════════════════
    // TEST 5: OrderItems boşsa hata vermeli
    // ══════════════════════════════════════════
    [Fact]
    public void Validate_EmptyOrderItems_ShouldHaveError()
    {
        var command = CreateValidCommand();
        command.OrderItems = new List<CreateOrderItemDto>(); // boş liste

        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.OrderItems);
    }

    // ══════════════════════════════════════════
    // TEST 6: OrderItem'da ProductId boşsa hata vermeli
    // ══════════════════════════════════════════
    [Fact]
    public void Validate_OrderItemEmptyProductId_ShouldHaveError()
    {
        var command = CreateValidCommand();
        command.OrderItems[0].ProductId = Guid.Empty;

        var result = _validator.TestValidate(command);
        Assert.False(result.IsValid);
    }

    // ══════════════════════════════════════════
    // TEST 7: OrderItem'da Quantity 0 ise hata vermeli
    // ══════════════════════════════════════════
    [Fact]
    public void Validate_OrderItemZeroQuantity_ShouldHaveError()
    {
        var command = CreateValidCommand();
        command.OrderItems[0].Quantity = 0;

        var result = _validator.TestValidate(command);
        Assert.False(result.IsValid);
    }

    // ══════════════════════════════════════════
    // TEST 8: OrderItem'da UnitPrice 0 ise hata vermeli
    // ══════════════════════════════════════════
    [Fact]
    public void Validate_OrderItemZeroUnitPrice_ShouldHaveError()
    {
        var command = CreateValidCommand();
        command.OrderItems[0].UnitPrice = 0;

        var result = _validator.TestValidate(command);
        Assert.False(result.IsValid);
    }
}