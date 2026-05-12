using MediatR;
using MiniETicaret.Application.Emails;
using MiniETicaret.Application.Interfaces;
using MiniETicaret.Domain.Entities;

namespace MiniETicaret.Application.Features.Auth.Commands.Register;

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, Guid>
{
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IEmailService _emailService;

    public RegisterCommandHandler(
        IUserRepository userRepository,
        IUnitOfWork unitOfWork,
        IEmailService emailService)
    {
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
        _emailService = emailService;
    }
    public async Task<Guid> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        // 1. Bu email zaten kayıtlı mı?
        var existingUser = await _userRepository.GetByEmailAsync(request.Email);
        if (existingUser is not null)
            throw new InvalidOperationException("Bu email adresi zaten kullanılıyor.");
        // 2. Şifreyi hashle
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        // 3. Yeni kullanıcı oluştur
        var user = new AppUser
        {
            FullName = request.FullName,
            Email = request.Email,
            PasswordHash = passwordHash,
            IsActive = true,
            RoleId = Guid.Parse("22222222-2222-2222-2222-222222222222"), // Default: User rolü
            PhoneNumber = request.PhoneNumber,
            Address = request.Address,
            Gender = request.Gender,
            BirthDate = request.BirthDate.HasValue
                  ? DateTime.SpecifyKind(request.BirthDate.Value, DateTimeKind.Utc)
                  : null
        };
        // 4. Veritabanına kaydet
        await _userRepository.AddAsync(user);
        await _unitOfWork.SaveChangesAsync();

        // 5. Hoşgeldin maili gönder. SendAsync içinde try/catch + log var,
        //    mail hatası register akışını bozmaz.
        var html = EmailTemplates.Welcome(user.FullName);
        await _emailService.SendAsync(user.Email, "whoopsy'e hoş geldin!", html, cancellationToken);

        // 6. Yeni kullanıcının Id'sini döndür
        return user.Id;
    }
}
