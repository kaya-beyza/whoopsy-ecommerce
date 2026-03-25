using MiniETicaret.Domain.Entities;
  using MiniETicaret.Domain.Enums;

  namespace MiniETicaret.Application.Interfaces;

  public interface IOrderRepository
  {
      Task<Order?> GetByIdAsync(Guid id);
      Task<Order?> GetByIdWithDetailsAsync(Guid id);
      Task<List<Order>> GetAllAsync(int page, int size, OrderStatus? status = null);
      Task<List<Order>> GetByUserIdAsync(Guid userId);
      Task<int> GetTotalCountAsync(OrderStatus? status = null);
      Task<Order> AddAsync(Order order);
      Task UpdateAsync(Order order);
  }