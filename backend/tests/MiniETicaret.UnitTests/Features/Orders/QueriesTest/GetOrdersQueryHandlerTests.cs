using Moq;
using MiniETicaret.Application.Features.Orders.Queries.GetOrders;
using MiniETicaret.Application.Interfaces;
using MiniETicaret.Domain.Entities;
using MiniETicaret.Domain.Enums;

namespace MiniETicaret.UnitTests.Features.Orders.QueriesTest;

public class GetOrdersQueryHandlerTests
{
    private readonly Mock<IOrderRepository> _mockOrderRepo;
    private readonly GetOrdersQueryHandler _handler;

    public GetOrdersQueryHandlerTests()
    {
        _mockOrderRepo = new Mock<IOrderRepository>();
        _handler = new GetOrdersQueryHandler(_mockOrderRepo.Object);
    }

    // ══════════════════════════════════════════
    // TEST 1: Siparişler başarıyla listelenmeli
    // ══════════════════════════════════════════
    [Fact]
    public async Task Handle_OrdersExist_ReturnsPaginatedResult()
    {
        // ARRANGE — 2 sipariş oluştur
        var orders = new List<Order>
          {
              new()
              {
                  Id = Guid.NewGuid(),
                  UserId = Guid.NewGuid(),
                  TotalAmount = 300m,
                  Status = OrderStatus.Pending,
                  ShippingAddress = "İstanbul",
                  CreatedDate = DateTime.UtcNow,
                  OrderItems = new List<OrderItem>
                  {
                      new() { ProductId = Guid.NewGuid(), Quantity = 2, UnitPrice = 150m }
                  }
              },
              new()
              {
                  Id = Guid.NewGuid(),
                  UserId = Guid.NewGuid(),
                  TotalAmount = 500m,
                  Status = OrderStatus.Confirmed,
                  ShippingAddress = "Ankara",
                  CreatedDate = DateTime.UtcNow,
                  OrderItems = new List<OrderItem>
                  {
                      new() { ProductId = Guid.NewGuid(), Quantity = 1, UnitPrice = 500m }
                  }
              }
          };

        _mockOrderRepo
            .Setup(repo => repo.GetAllAsync(1, 10, null))
            .ReturnsAsync(orders);

        _mockOrderRepo
            .Setup(repo => repo.GetTotalCountAsync(null))
            .ReturnsAsync(2);

        var query = new GetOrdersQuery { Page = 1, Size = 10, Status = null };

        // ACT
        var result = await _handler.Handle(query, CancellationToken.None);

        // ASSERT
        Assert.NotNull(result);
        Assert.Equal(2, result.Items.Count);       // 2 sipariş dönmeli
        Assert.Equal(2, result.TotalCount);         // toplam 2 kayıt
        Assert.Equal(1, result.Page);               // sayfa 1
        Assert.Equal(10, result.Size);              // sayfa boyutu 10
        Assert.Equal(1, result.TotalPages);         // 2/10 = 1 sayfa
    }

    // ══════════════════════════════════════════
    // TEST 2: Sipariş yoksa boş liste dönmeli
    // ══════════════════════════════════════════
    [Fact]
    public async Task Handle_NoOrders_ReturnsEmptyPaginatedResult()
    {
        // ARRANGE — boş liste döndür
        _mockOrderRepo
            .Setup(repo => repo.GetAllAsync(1, 10, null))
            .ReturnsAsync(new List<Order>());

        _mockOrderRepo
            .Setup(repo => repo.GetTotalCountAsync(null))
            .ReturnsAsync(0);

        var query = new GetOrdersQuery { Page = 1, Size = 10, Status = null };

        // ACT
        var result = await _handler.Handle(query, CancellationToken.None);

        // ASSERT
        Assert.NotNull(result);
        Assert.Empty(result.Items);           // liste boş olmalı
        Assert.Equal(0, result.TotalCount);   // toplam 0 kayıt
    }
}