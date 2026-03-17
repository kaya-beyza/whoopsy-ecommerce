using MediatR;
using MiniETicaret.Application.DTOs;
namespace MiniETicaret.Application.Features.Auth.Queries.GetUsers;

public class GetUsersQuery : IRequest<List<UserDto>>
{
    public int Page { get; set; } = 1;
    public int Size { get; set; } = 10;
}