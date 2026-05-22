using MediatR;
using MiniETicaret.Application.Emails;
using MiniETicaret.Application.Interfaces;
using MiniETicaret.Domain.Entities;
using MiniETicaret.Domain.Enums;

namespace MiniETicaret.Application.Features.Auth.Commands.RegisterAdmin;

public class RegisterAdminCommandHandler : IRequestHandler<RegisterAdminCommand, Guid>
{
    private static readonly Guid AdminRoleId = Guid.Parse("11111111-1111-1111-1111-111111111111");

    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IEmailService _emailService;
    private readonly IAdminApprovalSettings _settings;

    public RegisterAdminCommandHandler(
        IUserRepository userRepository,
        IUnitOfWork unitOfWork,
        IEmailService emailService,
        IAdminApprovalSettings settings)
    {
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
        _emailService = emailService;
        _settings = settings;
    }

    public async Task<Guid> Handle(RegisterAdminCommand request, CancellationToken cancellationToken)
    {
        // 1. Gate password kontrolü — yanlışsa direkt reddet.
        if (string.IsNullOrWhiteSpace(_settings.GatePassword))
            throw new InvalidOperationException("Admin başvuru sistemi şu anda yapılandırılmamış.");

        if (!string.Equals(request.GatePassword, _settings.GatePassword, StringComparison.Ordinal))
            throw new UnauthorizedAccessException("Erişim şifresi hatalı.");

        // 2. Email zaten kayıtlı mı?
        var existingUser = await _userRepository.GetByEmailAsync(request.Email);
        if (existingUser is not null)
            throw new InvalidOperationException("Bu email adresi zaten kullanılıyor.");

        if (string.IsNullOrWhiteSpace(_settings.NotificationEmail))
            throw new InvalidOperationException("Onay e-posta adresi yapılandırılmamış.");

        // 3. Şifreyi hashle
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        // 4. Tek kullanımlık onay token'ı üret (24 saat geçerli).
        var approvalToken = Guid.NewGuid();
        var tokenExpires = DateTime.UtcNow.AddHours(24);

        // 5. Admin başvurusu — IsApproved=false, ApprovalStatus=Pending.
        //    Login engelinde bu iki alana bakılacak.
        var user = new AppUser
        {
            FullName = request.FullName,
            Email = request.Email,
            PasswordHash = passwordHash,
            IsActive = true,
            IsApproved = false,
            ApprovalStatus = AdminApprovalStatus.Pending,
            ApprovalToken = approvalToken,
            ApprovalTokenExpiresAt = tokenExpires,
            RoleId = AdminRoleId,
            PhoneNumber = request.PhoneNumber,
            Gender = request.Gender,
            BirthDate = request.BirthDate.HasValue
                ? DateTime.SpecifyKind(request.BirthDate.Value, DateTimeKind.Utc)
                : null
        };

        await _userRepository.AddAsync(user);
        await _unitOfWork.SaveChangesAsync();

        // 6. Onay mailini kurucu admin'e gönder.
        var approveUrl = $"{_settings.ApiBaseUrl}/api/Admin/approve/{approvalToken}";
        var rejectUrl = $"{_settings.ApiBaseUrl}/api/Admin/reject/{approvalToken}";

        var html = EmailTemplates.AdminApprovalRequest(
            applicantName: user.FullName,
            applicantEmail: user.Email,
            applicantPhone: user.PhoneNumber ?? "",
            approveUrl: approveUrl,
            rejectUrl: rejectUrl);

        await _emailService.SendAsync(_settings.NotificationEmail, "Yeni admin başvurusu — whoopsy", html, cancellationToken);

        return user.Id;
    }
}
