using MediatR;
using MiniETicaret.Application.DTOs;
namespace MiniETicaret.Application.Features.Auth.Queries.GetUserById;

public class GetUserByIdQuery : IRequest<UserDto>  // IRequest<UserDto> → MediatR'a "bu query'i çalıştırınca bana bir UserDto döndür" diyorsun.
{
    public Guid Id{get;set;}
}