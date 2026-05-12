using MiniETicaret.Domain.Entities;
using MiniETicaret.Domain.Enums;

namespace MiniETicaret.UnitTests.Entities;

// Rich domain modelin en büyük artısı: kuralları handler/mock/db olmadan, saf domain logic olarak test edebiliriz.
public class OrderTests
{
    // Test setup'larında belirli bir state'e götürmek için kısa helper.
    // (Her test "new Order()" ile başlar; default Status = Pending.)
    private static Order CreateOrderInStatus(OrderStatus target)
    {
        var order = new Order();
        if (target == OrderStatus.Pending) return order;
        order.Confirm();
        if (target == OrderStatus.Confirmed) return order;
        order.Ship();
        if (target == OrderStatus.Shipped) return order;
        order.Deliver();
        if (target == OrderStatus.Delivered) return order;

        if (target == OrderStatus.Cancelled)
        {
            // Cancel — Confirmed'tan iptal et (transition izinli, basit)
            var cancellable = new Order();
            cancellable.Cancel();
            return cancellable;
        }

        order.RequestReturn();
        if (target == OrderStatus.ReturnRequested) return order;

        if (target == OrderStatus.ReturnRejected)
        {
            order.RejectReturn();
            return order;
        }

        order.ApproveReturn();
        if (target == OrderStatus.ReturnApproved) return order;
        order.CompleteReturn();
        return order;   // Returned
    }

    // ════════════════════════════════════════
    // Happy path: forward transitions
    // ════════════════════════════════════════

    [Fact]
    public void Confirm_WhenPending_TransitionsToConfirmed()
    {
        var order = new Order();
        order.Confirm();
        Assert.Equal(OrderStatus.Confirmed, order.Status);
    }

    [Fact]
    public void Ship_WhenConfirmed_TransitionsToShipped()
    {
        var order = CreateOrderInStatus(OrderStatus.Confirmed);
        order.Ship();
        Assert.Equal(OrderStatus.Shipped, order.Status);
    }

    [Fact]
    public void Deliver_WhenShipped_TransitionsToDelivered()
    {
        var order = CreateOrderInStatus(OrderStatus.Shipped);
        order.Deliver();
        Assert.Equal(OrderStatus.Delivered, order.Status);
    }

    // ════════════════════════════════════════
    // Cancel — özel kural: sadece Pending veya Confirmed iptal edilebilir
    // ════════════════════════════════════════

    [Fact]
    public void Cancel_WhenPending_Succeeds()
    {
        var order = new Order();
        order.Cancel();
        Assert.Equal(OrderStatus.Cancelled, order.Status);
    }

    [Fact]
    public void Cancel_WhenConfirmed_Succeeds()
    {
        var order = CreateOrderInStatus(OrderStatus.Confirmed);
        order.Cancel();
        Assert.Equal(OrderStatus.Cancelled, order.Status);
    }

    [Fact]
    public void Cancel_WhenShipped_Throws()
    {
        var order = CreateOrderInStatus(OrderStatus.Shipped);
        Assert.Throws<InvalidOperationException>(() => order.Cancel());
    }

    [Fact]
    public void Cancel_WhenDelivered_Throws()
    {
        var order = CreateOrderInStatus(OrderStatus.Delivered);
        Assert.Throws<InvalidOperationException>(() => order.Cancel());
    }

    // ════════════════════════════════════════
    // İade akışı
    // ════════════════════════════════════════

    [Fact]
    public void RequestReturn_WhenDelivered_TransitionsToReturnRequested()
    {
        var order = CreateOrderInStatus(OrderStatus.Delivered);
        order.RequestReturn();
        Assert.Equal(OrderStatus.ReturnRequested, order.Status);
    }

    [Fact]
    public void RequestReturn_WhenPending_Throws()
    {
        // Teslim edilmemiş sipariş iade edilemez — en kritik kural.
        var order = new Order();
        Assert.Throws<InvalidOperationException>(() => order.RequestReturn());
    }

    [Fact]
    public void RequestReturn_WhenShipped_Throws()
    {
        // Kargoda olan iade edilemez; önce teslim olsun.
        var order = CreateOrderInStatus(OrderStatus.Shipped);
        Assert.Throws<InvalidOperationException>(() => order.RequestReturn());
    }

    [Fact]
    public void ApproveReturn_WhenReturnRequested_Succeeds()
    {
        var order = CreateOrderInStatus(OrderStatus.ReturnRequested);
        order.ApproveReturn();
        Assert.Equal(OrderStatus.ReturnApproved, order.Status);
    }

    [Fact]
    public void RejectReturn_WhenReturnRequested_Succeeds()
    {
        var order = CreateOrderInStatus(OrderStatus.ReturnRequested);
        order.RejectReturn();
        Assert.Equal(OrderStatus.ReturnRejected, order.Status);
    }

    [Fact]
    public void CompleteReturn_WhenReturnApproved_Succeeds()
    {
        var order = CreateOrderInStatus(OrderStatus.ReturnApproved);
        order.CompleteReturn();
        Assert.Equal(OrderStatus.Returned, order.Status);
    }

    [Fact]
    public void CompleteReturn_WhenReturnRejected_Throws()
    {
        // Reddedilen iade tamamlanamaz — yalnızca onaylanmış olanlar tamamlanır.
        var order = CreateOrderInStatus(OrderStatus.ReturnRejected);
        Assert.Throws<InvalidOperationException>(() => order.CompleteReturn());
    }

    // ════════════════════════════════════════
    // Terminal states: bitmiş siparişe ileri geçiş yapılamaz
    // ════════════════════════════════════════

    [Fact]
    public void Confirm_WhenCancelled_Throws()
    {
        var order = CreateOrderInStatus(OrderStatus.Cancelled);
        Assert.Throws<InvalidOperationException>(() => order.Confirm());
    }

    [Fact]
    public void Confirm_WhenReturned_Throws()
    {
        var order = CreateOrderInStatus(OrderStatus.Returned);
        Assert.Throws<InvalidOperationException>(() => order.Confirm());
    }

    [Fact]
    public void Ship_WhenPending_Throws()
    {
        // Pending → Shipped doğrudan atlanamaz; önce Confirmed gerekli.
        var order = new Order();
        Assert.Throws<InvalidOperationException>(() => order.Ship());
    }

    // ════════════════════════════════════════
    // Default state
    // ════════════════════════════════════════

    [Fact]
    public void NewOrder_HasPendingStatusByDefault()
    {
        var order = new Order();
        Assert.Equal(OrderStatus.Pending, order.Status);
    }
}
