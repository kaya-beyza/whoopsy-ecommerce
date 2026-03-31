using Moq;
using MiniETicaret.Application.Features.Orders.Commands.CreateOrder;
using MiniETicaret.Application.Interfaces;
using MiniETicaret.Domain.Entities;
using MiniETicaret.Domain.Enums;

namespace MiniETicaret.UnitTests.Features.Orders.CommandsTest;

public class CreateOrderCommandHandlerTests
{
    private readonly Mock<IOrderRepository> _mockOrderRepo;
    private readonly CreateOrderCommandHandler _handler;

    public CreateOrderCommandHandlerTests()
    {
        _mockOrderRepo = new Mock<IOrderRepository>();
        _handler = new CreateOrderCommandHandler(_mockOrderRepo.Object);
    }

    // ══════════════════════════════════════════
    // TEST 1: Sipariş başarıyla oluşturulmalı
    // ══════════════════════════════════════════
    [Fact]
    public async Task Handle_ValidCommand_ReturnsNewOrderId()
    {
        // ARRANGE — geçerli bir sipariş komutu hazırla
        _mockOrderRepo
               .Setup(repo => repo.AddAsync(It.IsAny<Order>()))
               .Returns<Order>(order =>
               {
                   order.Id = Guid.NewGuid();
                   return Task.FromResult(order);
               });

        var command = new CreateOrderCommand
        {
            UserId = Guid.NewGuid(),
            ShippingAddress = "İstanbul, Kadıköy, Test Mah. No:1",
            OrderItems = new List<CreateOrderItemDto>
              {
                  new() { ProductId = Guid.NewGuid(), Quantity = 2, UnitPrice = 100m },
                  new() { ProductId = Guid.NewGuid(), Quantity = 1, UnitPrice = 250m }
              }
        };

        // ACT — handler'ı çalıştır
        var result = await _handler.Handle(command, CancellationToken.None);

        // ASSERT — dönen Id boş olmamalı (yeni sipariş oluştu)
        Assert.NotEqual(Guid.Empty, result);

        // Repository'nin AddAsync'i TAM 1 KERE çağrıldığını doğrula
        _mockOrderRepo.Verify(repo => repo.AddAsync(It.IsAny<Order>()), Times.Once);
    }

    // ══════════════════════════════════════════
    // TEST 2: TotalAmount sunucu tarafında doğru hesaplanmalı
    // ══════════════════════════════════════════
    [Fact]
    public async Task Handle_ValidCommand_CalculatesTotalAmountCorrectly()
    {
        // ARRANGE — kaydedilen siparişi yakalayacağız
        Order? capturedOrder = null;

        _mockOrderRepo
             .Setup(repo => repo.AddAsync(It.IsAny<Order>()))
             .Returns<Order>(order =>
             {
                 capturedOrder = order;
                 return Task.FromResult(order);
             });

        var command = new CreateOrderCommand
        {
            UserId = Guid.NewGuid(),
            ShippingAddress = "Ankara, Çankaya",
            OrderItems = new List<CreateOrderItemDto>
              {
                  new() { ProductId = Guid.NewGuid(), Quantity = 3, UnitPrice = 50m },
                  new() { ProductId = Guid.NewGuid(), Quantity = 2, UnitPrice = 75m }
              }
        };

        // ACT
        await _handler.Handle(command, CancellationToken.None);

        // ASSERT — TotalAmount = (3×50) + (2×75) = 300
        Assert.NotNull(capturedOrder);
        Assert.Equal(300m, capturedOrder!.TotalAmount);
        Assert.Equal(OrderStatus.Pending, capturedOrder.Status); // başlangıç durumu Pending olmalı
        Assert.Equal(2, capturedOrder.OrderItems.Count);         // 2 ürün olmalı
    }
}