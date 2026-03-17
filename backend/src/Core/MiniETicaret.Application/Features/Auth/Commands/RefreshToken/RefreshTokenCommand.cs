using System.Text;
using MediatR;
using MiniETicaret.Application.DTOs;                                                                                                           
namespace MiniETicaret.Application.Features.Auth.Commands.RefreshToken;

/*Akış şöyle:                                                                                                                                      1. Frontend'den Refresh Token gelir
  2. Veritabanında bu token var mı? → Kontrol et                                                                                                   3. Süresi dolmuş mu? Revoke edilmiş mi? → Kontrol et
  4. Eski Refresh Token'ı revoke et (bir daha kullanılamasın)                                                                                    
  5. Yeni Access Token + yeni Refresh Token üret                                                                                                 
  6. Yeni Refresh Token'ı veritabanına kaydet                                                                                                    
  7. TokenDto olarak döndür*/

  public class RefreshTokenCommand : IRequest<TokenDto>
{
    public string Token{get;set;}=string.Empty;
}