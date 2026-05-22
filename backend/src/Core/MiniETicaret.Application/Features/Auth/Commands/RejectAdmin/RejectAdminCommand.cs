using MediatR;

namespace MiniETicaret.Application.Features.Auth.Commands.RejectAdmin;

public class RejectAdminCommand : IRequest<string>
{
    public Guid Token { get; set; }

    public RejectAdminCommand(Guid token)
    {
        Token = token;
    }
}
