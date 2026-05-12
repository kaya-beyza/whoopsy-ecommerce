using Moq;
using MiniETicaret.Application.Features.Orders.Commands.UpdateOrderStatus;
using MiniETicaret.Application.Interfaces;
using MiniETicaret.Domain.Entities;
using MiniETicaret.Domain.Enums;

namespace MiniETicaret.UnitTests.Features.Orders.CommandsTest;

public class UpdateOrderStatusCommandHandlerTests
{
    private readonly Mock<IOrderRepository> _mockOrderRepo;
    private readonly Mock<IUnitOfWork> _mockUnitOfWork;
    private readonly UpdateOrderStatusCommandHandler _handler;

    public UpdateOrderStatusCommandHandlerTests()
    {
        _mockOrderRepo = new Mock<IOrderRepository>();
        _mockUnitOfWork = new Mock<IUnitOfWork>();
        _handler = new UpdateOrderStatusCommandHandler(_mockOrderRepo.Object, _mockUnitOfWork.Object);
    }

    // ══════════════════════════════════════════
    // TEST 1: Sipariş durumu başarıyla güncellenmeli
    // ══════════════════════════════════════════
    [Fact]
    public async Task Handle_ValidCommand_UpdatesOrderStatusSuccessfully()
    {
        // ARRANGE — Pending durumunda bir sipariş oluştur
        var orderId = Guid.NewGuid();
        var existingOrder = new Order
        {
            Id = orderId,
            UserId = Guid.NewGuid(),
            TotalAmount = 500m,
            ShippingAddress = "İstanbul"
            // Status default Pending — Order.cs'de tanımlı, atamaya gerek yok
        };

        _mockOrderRepo
            .Setup(repo => repo.GetByIdAsync(orderId))
            .ReturnsAsync(existingOrder);

        _mockOrderRepo
            .Setup(repo => repo.UpdateAsync(It.IsAny<Order>()))
            .Returns(Task.CompletedTask);

        var command = new UpdateOrderStatusCommand
        {
            OrderId = orderId,
            NewStatus = OrderStatus.Confirmed
        };

        // ACT — handler'ı çalıştır
        await _handler.Handle(command, CancellationToken.None);

        // ASSERT — durum Confirmed'a değişmiş olmalı
        Assert.Equal(OrderStatus.Confirmed, existingOrder.Status);
        Assert.NotNull(existingOrder.UpdatedDate);

        // UpdateAsync'in çağrıldığını doğrula
        _mockOrderRepo.Verify(repo => repo.UpdateAsync(It.IsAny<Order>()), Times.Once);
    }

    // ══════════════════════════════════════════
    // TEST 2: Sipariş bulunamazsa hata fırlatmalı
    // ══════════════════════════════════════════
    [Fact]
    public async Task Handle_OrderNotFound_ThrowsKeyNotFoundException()
    {
        // ARRANGE — repository null döndürsün (sipariş yok)
        var fakeOrderId = Guid.NewGuid();

        _mockOrderRepo
            .Setup(repo => repo.GetByIdAsync(fakeOrderId))
            .ReturnsAsync((Order?)null);

        var command = new UpdateOrderStatusCommand
        {
            OrderId = fakeOrderId,
            NewStatus = OrderStatus.Shipped
        };

        // ACT & ASSERT — KeyNotFoundException fırlatmalı
        await Assert.ThrowsAsync<KeyNotFoundException>(
            () => _handler.Handle(command, CancellationToken.None)
        );

        // UpdateAsync HİÇ çağrılmamalı (sipariş yok, güncelleme olmamalı)
        _mockOrderRepo.Verify(repo => repo.UpdateAsync(It.IsAny<Order>()), Times.Never);
    }
}