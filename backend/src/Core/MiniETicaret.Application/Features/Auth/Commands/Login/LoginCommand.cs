using MediatR;
using MiniETicaret.Application.DTOs;

namespace MiniETicaret.Application.Features.Auth.Commands.Login;

public class LoginCommand : IRequest<TokenDto>
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}