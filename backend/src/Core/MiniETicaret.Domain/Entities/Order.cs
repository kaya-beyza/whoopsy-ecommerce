using MiniETicaret.Domain.Common;
  using MiniETicaret.Domain.Enums;

  namespace MiniETicaret.Domain.Entities;

  public class Order : BaseEntity
  {
      public Guid UserId { get; set; }
      public AppUser User { get; set; } = null!;
      public decimal TotalAmount { get; set; }

      // ← Setter artık private. Dışarıdan sadece method üzerinden değişir.
      public OrderStatus Status { get; private set; } = OrderStatus.Pending;

      public string ShippingAddress { get; set; } = string.Empty;
      public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
      public Payment? Payment { get; set; }

      // ═══════════════════════════════════════
      // State transition methods
      // Her method: (1) mevcut durumu doğrula, (2) yeni duruma geç.
      // ═══════════════════════════════════════

      public void Confirm()
      {
          EnsureCurrent(OrderStatus.Pending);
          Status = OrderStatus.Confirmed;
      }

      public void Ship()
      {
          EnsureCurrent(OrderStatus.Confirmed);
          Status = OrderStatus.Shipped;
      }

      public void Deliver()
      {
          EnsureCurrent(OrderStatus.Shipped);
          Status = OrderStatus.Delivered;
      }

      // İptal sadece kargoya verilmeden mümkün — özel kural, helper'a sığmaz.
      public void Cancel()
      {
          if (Status != OrderStatus.Pending && Status != OrderStatus.Confirmed)
              throw new InvalidOperationException(
                  $"Sipariş iptal edilemez. Mevcut durum: {Status}. Sadece Pending veya Confirmed iptal edilebilir.");
          Status = OrderStatus.Cancelled;
      }

      public void RequestReturn()
      {
          EnsureCurrent(OrderStatus.Delivered);
          Status = OrderStatus.ReturnRequested;
      }

      public void ApproveReturn()
      {
          EnsureCurrent(OrderStatus.ReturnRequested);
          Status = OrderStatus.ReturnApproved;
      }

      public void RejectReturn()
      {
          EnsureCurrent(OrderStatus.ReturnRequested);
          Status = OrderStatus.ReturnRejected;
      }

      public void CompleteReturn()
      {
          EnsureCurrent(OrderStatus.ReturnApproved);
          Status = OrderStatus.Returned;
      }

      // Tek state bekleyen geçişler için ortak guard.
      private void EnsureCurrent(OrderStatus expected)
      {
          if (Status != expected)
              throw new InvalidOperationException(
                  $"Geçersiz durum geçişi. Beklenen: {expected}, Mevcut: {Status}.");
      }
  }