using MediatR;
using MiniETicaret.Application.Interfaces;
using MiniETicaret.Domain.Entities;

namespace MiniETicaret.Application.Features.Auth.Commands.Register;

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, Guid>
{
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    public RegisterCommandHandler(
        IUserRepository userRepository,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
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
             RoleId = Guid.Parse("22222222-2222-2222-2222-222222222222") // Default: User rolü
        };
        // 4. Veritabanına kaydet                                                                                                              
        await _userRepository.AddAsync(user); //Kullanıcıyı EF Core'un hafızasına ekliyor (henüz veritabanına yazmadı!)
        await _unitOfWork.SaveChangesAsync(); //İşte şimdi veritabanına yazıyor. İki adımlı bu süreci hatırlıyorsun — EF Core önce hafızada hazırlar
        // 5. Yeni kullanıcının Id'sini döndür
        return user.Id;  // EF Core, AddAsync sırasında user.Id'ye otomatik bir Guid atar. Bu Id'yi frontend'e döndürüyoruz.                                                                                                'yi frontend'e döndürüyoruz.
    }
}