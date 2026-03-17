using System.Diagnostics.Contracts;
using System.Security.Cryptography.X509Certificates;
using System.Text;

namespace MiniETicaret.Application.DTOs;
//Kullanıcı giriş yaptığında veya token yenilediğinde frontend'e ne döneceğiz? Access Token, Refresh Token ve token'ın ne zaman biteceği bilgisi
public class TokenDto
{
    public string AccessToken{get;set;}=string.Empty;
    public string RefreshToken{get;set;}=string.Empty;
    public DateTime ExpiresAt{get;set;}
}