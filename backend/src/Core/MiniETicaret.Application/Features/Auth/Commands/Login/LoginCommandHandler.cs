using MediatR;
using MiniETicaret.Application.DTOs;
using MiniETicaret.Application.Interfaces;
namespace MiniETicaret.Application.Features.Auth.Commands.Login;
/*  LoginCommand'ı hatırlıyorsun — sadece Email ve Password taşıyordu. Şimdi Handler bu bilgiyi alıp şunları yapacak:

  1. Email ile kullanıcıyı veritabanında ara
  2. Bulunamazsa → hata fırlat
  3. Şifreyi kontrol et (hash karşılaştırması)
  4. Yanlışsa → hata fırlat
  5. Doğruysa → Access Token + Refresh Token üret
  6. Refresh Token'ı veritabanına kaydet
  7. TokenDto olarak döndür*/

public class LoginCommandHandler : IRequestHandler<LoginCommand, TokenDto>
{
    private readonly IUserRepository _userRepository;
    private readonly ITokenService _tokenService;
    private readonly IUnitOfWork _unitOfWork;

    public LoginCommandHandler(
          IUserRepository userRepository,
          ITokenService tokenService,
          IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _tokenService = tokenService;
        _unitOfWork = unitOfWork;
    }

    public async Task<TokenDto> Handle(LoginCommand request, CancellationToken cancelllationToken)
    {
        // 1. Email ile Kullanıcıyı bul
        var user = await _userRepository.GetByEmailAsync(request.Email);
        if (user is null || !user.IsActive)
            throw new UnauthorizedAccessException("Geçersiz Email veya Şifre");

        // 2. Şifre Kontrolü (Bcraypt hash karşılaştırması)
        bool isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);

        if (!isPasswordValid)
            throw new UnauthorizedAccessException("Geçersiz email veya Şifre");

        // 3.Token Üret
        var accessToken = _tokenService.GenerateAccessToken(user);
        var refreshToken = _tokenService.GenerateRefreshToken();

        // 4.Refresh Token'ı Veritabanına kaydet
        var refreshTokenEntity = new MiniETicaret.Domain.Entities.RefreshToken
        {
            Token = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            IsRevoked = false,
            AppUserId = user.Id
        };

        user.RefreshTokens.Add(refreshTokenEntity);
        await _userRepository.UpdateAsync(user);
        await _unitOfWork.SaveChangesAsync();

        // 5. Sonucu Döndür.
        return new TokenDto
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddMinutes(15)
        };
    }
}