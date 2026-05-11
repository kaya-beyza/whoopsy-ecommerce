using MediatR;

namespace MiniETicaret.Application.Features.Users.Commands.UpdateUserProfile;

public class UpdateUserProfileCommand : IRequest<UpdateUserProfileCommandResponse>
{
    public Guid UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public DateTime BirthDate { get; set; }
}

public class UpdateUserProfileCommandResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
}