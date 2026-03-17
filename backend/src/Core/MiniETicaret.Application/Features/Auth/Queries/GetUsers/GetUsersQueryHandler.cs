using MediatR;
using MiniETicaret.Application.DTOs;
using MiniETicaret.Application.Interfaces;

namespace MiniETicaret.Application.Features.Auth.Queries.GetUsers;

public class GetUsersQueryHandler : IRequestHandler<GetUsersQuery, List<UserDto>>
{
    private readonly IUserRepository _userRepository;

    public GetUsersQueryHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<List<UserDto>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
    {
        var users = await _userRepository.GetAllAsync(request.Page,request.Size);

        return users.Select(u => new UserDto
        {
            Id = u.Id,
            FullName = u.FullName,
            Email = u.Email,
            IsActive = u.IsActive,
            RoleName = u.Role != null ? u.Role.Name : string.Empty
        }).ToList();
    }
}