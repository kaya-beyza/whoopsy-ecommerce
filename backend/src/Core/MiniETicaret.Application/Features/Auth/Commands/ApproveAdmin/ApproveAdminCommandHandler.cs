using MediatR;
using MiniETicaret.Application.Emails;
using MiniETicaret.Application.Interfaces;
using MiniETicaret.Domain.Enums;

namespace MiniETicaret.Application.Features.Auth.Commands.ApproveAdmin;

public class ApproveAdminCommandHandler : IRequestHandler<ApproveAdminCommand, string>
{
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IEmailService _emailService;

    public ApproveAdminCommandHandler(
        IUserRepository userRepository,
        IUnitOfWork unitOfWork,
        IEmailService emailService)
    {
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
        _emailService = emailService;
    }

    public async Task<string> Handle(ApproveAdminCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByApprovalTokenAsync(request.Token);
        if (user is null)
            throw new InvalidOperationException("Onay token'ı bulunamadı veya zaten kullanılmış.");

        if (user.ApprovalTokenExpiresAt is null || user.ApprovalTokenExpiresAt < DateTime.UtcNow)
            throw new InvalidOperationException("Onay token'ının süresi dolmuş.");

        if (user.ApprovalStatus != AdminApprovalStatus.Pending)
            throw new InvalidOperationException("Bu başvuru zaten işlenmiş.");

        user.IsApproved = true;
        user.ApprovalStatus = AdminApprovalStatus.Approved;
        user.ApprovalToken = null;
        user.ApprovalTokenExpiresAt = null;

        await _userRepository.UpdateAsync(user);
        await _unitOfWork.SaveChangesAsync();

        // Başvurucuya "onaylandı" maili gönder.
        var html = EmailTemplates.AdminApproved(user.FullName);
        await _emailService.SendAsync(user.Email, "Admin başvurun onaylandı — whoopsy", html, cancellationToken);

        return user.FullName;
    }
}
