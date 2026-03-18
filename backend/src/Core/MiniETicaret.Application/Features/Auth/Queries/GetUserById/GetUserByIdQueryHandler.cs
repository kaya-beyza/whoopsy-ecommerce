using MediatR;
using MiniETicaret.Application.DTOs;
using MiniETicaret.Application.Interfaces;
namespace MiniETicaret.Application.Features.Auth.Queries.GetUserById;

public class GetUserByIdQueryHandler : IRequestHandler<GetUserByIdQuery, UserDto> // MediatR'a "GetUserByIdQuery geldiğinde ben hallederim, UserDto döndürürüm" diyorsun.
{
    private readonly IUserRepository _userRepository; //Constructor injection ile repository'yi alıyorsun. Veritabanına direkt gitmiyorsun, interface üzerinden 
    public GetUserByIdQueryHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<UserDto> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.Id);

        if (user == null)
            throw new Exception($"User with ID {request.Id} not found.");
        return new UserDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            IsActive = user.IsActive,
            RoleName = user.Role?.Name ?? "Unknown",
            CreatedDate = user.CreatedDate
        };
    }
}