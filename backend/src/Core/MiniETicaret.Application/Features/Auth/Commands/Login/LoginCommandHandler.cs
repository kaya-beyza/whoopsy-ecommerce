using MediatR;
using MiniETicaret.Application.DTOs;
using MiniETicaret.Application.Interfaces;
namespace MiniETicaret.Applicatiın.Features.Auth.Commands.Login;
/*  LoginCommand'ı hatırlıyorsun — sadece Email ve Password taşıyordu. Şimdi Handler bu bilgiyi alıp şunları yapacak:

  1. Email ile kullanıcıyı veritabanında ara
  2. Bulunamazsa → hata fırlat
  3. Şifreyi kontrol et (hash karşılaştırması)
  4. Yanlışsa → hata fırlat
  5. Doğruysa → Access Token + Refresh Token üret
  6. Refresh Token'ı veritabanına kaydet
  7. TokenDto olarak döndür*/

public class LoginCommandHandler : IRequestHandler<LoginCommands, TokenDto>
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
         
    }
}