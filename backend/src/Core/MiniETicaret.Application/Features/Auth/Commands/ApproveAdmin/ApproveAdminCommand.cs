using MediatR;

namespace MiniETicaret.Application.Features.Auth.Commands.ApproveAdmin;

// Onay maili linkindeki token ile çağrılır. Sonuç: başvurucuya "onaylandı" maili gider.
public class ApproveAdminCommand : IRequest<string>
{
    public Guid Token { get; set; }

    public ApproveAdminCommand(Guid token)
    {
        Token = token;
    }
}
