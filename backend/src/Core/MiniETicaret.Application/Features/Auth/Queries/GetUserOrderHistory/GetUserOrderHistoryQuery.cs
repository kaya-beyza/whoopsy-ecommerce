using MediatR;
using MiniETicaret.Application.DTOs;

namespace MiniETicaret.Application.Features.Auth.Queries.GetUserOrderHistory;


/* Mantık aynı pattern: bir UserId veriyorsun, o kullanıcının tüm siparişlerini List<OrderDto> olarak 
döndürüyor. GetUserByIdQuery'de UserDto döndürüyordun, burada List<OrderDto> çünkü bir kullanıcının birden 
fazla siparişi olabilir.*/
public class GetUserOrderHistoryQuery : IRequest<List<OrderDto>>
{
    public Guid UserId { get; set; }
}