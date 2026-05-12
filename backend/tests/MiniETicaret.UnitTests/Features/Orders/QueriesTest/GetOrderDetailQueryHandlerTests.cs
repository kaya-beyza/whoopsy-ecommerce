using Moq;
using MiniETicaret.Application.Features.Orders.Queries.GetOrderDetail;
using MiniETicaret.Application.Interfaces;
using MiniETicaret.Domain.Entities;
using MiniETicaret.Domain.Enums;

namespace MiniETicaret.UnitTests.Features.Orders.QueriesTest;

public class GetOrderDetailQueryHandlerTests
{
    private readonly Mock<IOrderRepository> _mockOrderRepo;
    private readonly GetOrderDetailQueryHandler _handler;

    public GetOrderDetailQueryHandlerTests()
    {
        _mockOrderRepo = new Mock<IOrderRepository>();
        _handler = new GetOrderDetailQueryHandler(_mockOrderRepo.Object);
    }

    // ══════════════════════════════════════════
    // TEST 1: Sipariş detayı başarıyla dönmeli
    // ══════════════════════════════════════════
    [Fact]
    public async Task Handle_OrderExists_ReturnsOrderDetailDto()
    {
        // ARRANGE — detaylı bir sipariş oluştur (User ve Product dahil)
        var orderId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var productId = Guid.NewGuid();

        var order = new Order
        {
            Id = orderId,
            UserId = userId,
            TotalAmount = 450m,
            ShippingAddress = "İzmir, Bornova",
            CreatedDate = DateTime.UtcNow,
            User = new AppUser
            {
                Id = userId,
                FullName = "Ahmet Yılmaz",
                Email = "ahmet@mail.com",
                PasswordHash = "hash",
                RoleId = Guid.NewGuid()
            },
            OrderItems = new List<OrderItem>
              {
                  new()
                  {
                      ProductId = productId,
                      Quantity = 3,
                      UnitPrice = 150m,
                      Product = new Product { Id = productId, Name = "Test Ürün" }
                  }
              }
        };
        // Status için domain method'larını kullan — rich domain modeli (Pending → Confirmed → Shipped)
        order.Confirm();
        order.Ship();

        _mockOrderRepo
            .Setup(repo => repo.GetByIdWithDetailsAsync(orderId))
            .ReturnsAsync(order);

        var query = new GetOrderDetailQuery { OrderId = orderId };

        // ACT
        var result = await _handler.Handle(query, CancellationToken.None);

        // ASSERT — DTO doğru map'lenmiş mi kontrol et
        Assert.NotNull(result);
        Assert.Equal(orderId, result.Id);
        Assert.Equal(userId, result.UserId);
        Assert.Equal("Ahmet Yılmaz", result.UserFullName);
        Assert.Equal("ahmet@mail.com", result.UserEmail);
        Assert.Equal(450m, result.TotalAmount);
        Assert.Equal(OrderStatus.Shipped, result.Status);
        Assert.Equal("İzmir, Bornova", result.ShippingAddress);

        // OrderItems kontrolü
        Assert.Single(result.OrderItems);                          // 1 ürün olmalı
        Assert.Equal("Test Ürün", result.OrderItems[0].ProductName);
        Assert.Equal(3, result.OrderItems[0].Quantity);
        Assert.Equal(150m, result.OrderItems[0].UnitPrice);
    }

    // ══════════════════════════════════════════
    // TEST 2: Sipariş bulunamazsa hata fırlatmalı
    // ══════════════════════════════════════════
    [Fact]
    public async Task Handle_OrderNotFound_ThrowsKeyNotFoundException()
    {
        // ARRANGE — repository null döndürsün
        var fakeOrderId = Guid.NewGuid();

        _mockOrderRepo
            .Setup(repo => repo.GetByIdWithDetailsAsync(fakeOrderId))
            .ReturnsAsync((Order?)null);

        var query = new GetOrderDetailQuery { OrderId = fakeOrderId };

        // ACT & ASSERT
        await Assert.ThrowsAsync<KeyNotFoundException>(
            () => _handler.Handle(query, CancellationToken.None)
        );
    }
}