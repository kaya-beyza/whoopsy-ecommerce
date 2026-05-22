using MediatR;
using MiniETicaret.Domain.Enums;

namespace MiniETicaret.Application.Features.Auth.Commands.RegisterAdmin;

// Admin başvurusu. GatePassword .env'deki AdminApproval__GatePassword ile eşleşmeli.
// Eşleşmezse handler hata fırlatır (spam koruması).
public class RegisterAdminCommand : IRequest<Guid>
{
    public string GatePassword { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public UserGender? Gender { get; set; }
    public DateTime? BirthDate { get; set; }
}
