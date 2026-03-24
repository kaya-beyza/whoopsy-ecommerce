using Moq;
using MiniETicaret.Application.Features.Auth.Queries.GetUserOrderHistory;
using MiniETicaret.Application.Interfaces;
using MiniETicaret.Domain.Entities;
using MiniETicaret.Domain.Enums;

namespace MiniETicaret.UnitTests.Features.Auth.Queries;

public class GetUserOrderHistoryQueryHandlerTests
{
    private readonly Mock<IUserRepository> _mockUserRepo;
    private readonly GetUserOrderHistoryQueryHandler _handler;

    public GetUserOrderHistoryQueryHandlerTests()
    {
        _mockUserRepo = new Mock<IUserRepository>();
        _handler = new GetUserOrderHistoryQueryHandler(_mockUserRepo.Object);
    }

    // ══════════════════════════════════════════                                                                                                         
    // TEST 1: Kullanıcı bulunamazsa hata fırlat
    // ══════════════════════════════════════════
    [Fact]
    public async Task Handle_UserNotFound_ThrowsException()
    {
        // ARRANGE — bu ID ile kullanıcı yok
        var fakeUserId = Guid.NewGuid();

        _mockUserRepo
            .Setup(repo => repo.GetByIdWithOrdersAsync(fakeUserId))
            .ReturnsAsync((AppUser?)null);

        var query = new GetUserOrderHistoryQuery
        {
            UserId = fakeUserId
        };

        // ACT & ASSERT
        await Assert.ThrowsAsync<Exception>(
            () => _handler.Handle(query, CancellationToken.None)
        );
    }

    // ══════════════════════════════════════════                                                                                                         
    // TEST 2: Kullanıcı var ama siparişi yoksa boş liste döner
    // ══════════════════════════════════════════
    [Fact]
    public async Task Handle_UserHasNoOrders_ReturnsEmptyList()
    {
        // ARRANGE — kullanıcı var ama hiç siparişi yok
        var userId = Guid.NewGuid();

        var user = new AppUser
        {
            Id = userId,
            FullName = "Ahmet Yılmaz",
            Email = "ahmet@mail.com",
            IsActive = true,
            RoleId = Guid.NewGuid(),
            Orders = new List<Order>()  // ← boş sipariş listesi
        };

        _mockUserRepo
            .Setup(repo => repo.GetByIdWithOrdersAsync(userId))
            .ReturnsAsync(user);

        var query = new GetUserOrderHistoryQuery
        {
            UserId = userId
        };

        // ACT
        var result = await _handler.Handle(query, CancellationToken.None);

        // ASSERT
        Assert.NotNull(result);
        Assert.Empty(result);
    }
    // ══════════════════════════════════════════                                                                                                         
    // TEST 3: Kullanıcının siparişleri varsa doğru liste döner
    // ══════════════════════════════════════════
    [Fact]
    public async Task Handle_UserHasOrders_ReturnsOrderDtoList()
    {
        // ARRANGE — kullanıcının 1 siparişi var, içinde 2 ürün
        var userId = Guid.NewGuid();
        var orderId = Guid.NewGuid();
        var productId1 = Guid.NewGuid();
        var productId2 = Guid.NewGuid();
        var orderDate = new DateTime(2026, 3, 20);

        var user = new AppUser
        {
            Id = userId,
            FullName = "Ahmet Yılmaz",
            Email = "ahmet@mail.com",
            IsActive = true,
            RoleId = Guid.NewGuid(),
            Orders = new List<Order>
              {
                  new Order
                  {
                      Id = orderId,
                      TotalAmount = 350.00m,
                      Status = OrderStatus.Shipped,
                      ShippingAddress = "İstanbul, Kadıköy",
                      CreatedDate = orderDate,
                      OrderItems = new List<OrderItem>
                      {
                          new OrderItem
                          {
                              ProductId = productId1,
                              Product = new Product { Id = productId1, Name = "Laptop" },
                              Quantity = 1,
                              UnitPrice = 200.00m,
                          },
                          new OrderItem
                          {
                              ProductId = productId2,
                              Product = new Product { Id = productId2, Name = "Mouse" },
                              Quantity = 3,
                              UnitPrice = 50.00m,
                          }
                      }
                  }
              }
        };

        _mockUserRepo
            .Setup(repo => repo.GetByIdWithOrdersAsync(userId))
            .ReturnsAsync(user);

        var query = new GetUserOrderHistoryQuery
        {
            UserId = userId
        };

        // ACT
        var result = await _handler.Handle(query, CancellationToken.None);

        // ASSERT — Sipariş kontrolü
        Assert.Single(result);  // 1 sipariş olmalı
        var order = result[0];
        Assert.Equal(350.00m, order.TotalAmount);
        Assert.Equal(OrderStatus.Shipped, order.Status);
        Assert.Equal("İstanbul, Kadıköy", order.ShippingAddress);
        Assert.Equal(orderDate, order.CreatedDate);

        // ASSERT — Sipariş içindeki ürünler kontrolü
        Assert.Equal(2, order.OrderItems.Count);

        Assert.Equal("Laptop", order.OrderItems[0].ProductName);
        Assert.Equal(1, order.OrderItems[0].Quantity);
        Assert.Equal(200.00m, order.OrderItems[0].UnitPrice);
        Assert.Equal(200.00m, order.OrderItems[0].TotalPrice);

        Assert.Equal("Mouse", order.OrderItems[1].ProductName);
        Assert.Equal(3, order.OrderItems[1].Quantity);
        Assert.Equal(50.00m, order.OrderItems[1].UnitPrice);
        Assert.Equal(150.00m, order.OrderItems[1].TotalPrice);
    }

}