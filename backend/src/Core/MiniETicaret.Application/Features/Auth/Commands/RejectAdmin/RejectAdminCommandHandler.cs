using MediatR;
using MiniETicaret.Application.Emails;
using MiniETicaret.Application.Interfaces;
using MiniETicaret.Domain.Enums;

namespace MiniETicaret.Application.Features.Auth.Commands.RejectAdmin;

public class RejectAdminCommandHandler : IRequestHandler<RejectAdminCommand, string>
{
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IEmailService _emailService;

    public RejectAdminCommandHandler(
        IUserRepository userRepository,
        IUnitOfWork unitOfWork,
        IEmailService emailService)
    {
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
        _emailService = emailService;
    }

    public async Task<string> Handle(RejectAdminCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByApprovalTokenAsync(request.Token);
        if (user is null)
            throw new InvalidOperationException("Onay token'ı bulunamadı veya zaten kullanılmış.");

        if (user.ApprovalTokenExpiresAt is null || user.ApprovalTokenExpiresAt < DateTime.UtcNow)
            throw new InvalidOperationException("Onay token'ının süresi dolmuş.");

        if (user.ApprovalStatus != AdminApprovalStatus.Pending)
            throw new InvalidOperationException("Bu başvuru zaten işlenmiş.");

        user.IsApproved = false;
        user.ApprovalStatus = AdminApprovalStatus.Rejected;
        user.ApprovalToken = null;
        user.ApprovalTokenExpiresAt = null;
        // IsActive=false yapıyoruz ki bu kullanıcı normal login bile yapamasın.
        user.IsActive = false;

        await _userRepository.UpdateAsync(user);
        await _unitOfWork.SaveChangesAsync();

        var html = EmailTemplates.AdminRejected(user.FullName);
        await _emailService.SendAsync(user.Email, "Admin başvurun hakkında — whoopsy", html, cancellationToken);

        return user.FullName;
    }
}
