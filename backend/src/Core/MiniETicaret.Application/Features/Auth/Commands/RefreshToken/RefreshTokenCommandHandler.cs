using MediatR;
using MiniETicaret.Application.DTOs;
using MiniETicaret.Application.Interfaces;

namespace MiniETicaret.Application.Features.Auth.Commands.RefreshToken;

public class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, TokenDto>
{
    private readonly IUserRepository _userRepository;
    private readonly ITokenService _tokenService;
    private readonly IUnitOfWork _unitOfWork;

    public RefreshTokenCommandHandler(
        IUserRepository userRepository,
        ITokenService tokenService,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _tokenService = tokenService;
        _unitOfWork = unitOfWork;
    }
    public async Task<TokenDto> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        // 1. Token'ın sahibi kullanıcıyı bul
        var user = await _userRepository.GetByRefreshTokenAsync(request.Token);

        if (user is null)
            throw new UnauthorizedAccessException("Geçersiz refresh token.");

        // 2. Bu refresh token'ı bul ve kontrol et
        var existingToken = user.RefreshTokens
            .FirstOrDefault(rt => rt.Token == request.Token);

        if (existingToken is null || existingToken.IsRevoked || existingToken.ExpiresAt < DateTime.UtcNow)
            throw new UnauthorizedAccessException("Refresh token geçersiz veya süresi dolmuş.");

        // 3. Eski token'ı revoke et (bir daha kullanılamasın)
        existingToken.IsRevoked = true;

        // 4. Yeni tokenlar üret
        var newAccessToken = _tokenService.GenerateAccessToken(user);
        var newRefreshToken = _tokenService.GenerateRefreshToken();

        // 5. Yeni refresh token'ı veritabanına kaydet
        var newRefreshTokenEntity = new Domain.Entities.RefreshToken
        {
            Token = newRefreshToken,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            IsRevoked = false,
            AppUserId = user.Id
        };

        user.RefreshTokens.Add(newRefreshTokenEntity);
        await _userRepository.UpdateAsync(user);
        await _unitOfWork.SaveChangesAsync();

        // 6. Yeni tokenları döndür
        return new TokenDto
        {
            AccessToken = newAccessToken,
            RefreshToken = newRefreshToken,
            ExpiresAt = DateTime.UtcNow.AddMinutes(15)
        };
    }
}