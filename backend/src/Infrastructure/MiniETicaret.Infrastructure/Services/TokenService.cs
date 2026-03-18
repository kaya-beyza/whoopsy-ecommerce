using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using MiniETicaret.Application.Interfaces;
using MiniETicaret.Domain.Entities;
namespace MiniETicaret.Infrastructure.Services;


public class TokenService : ITokenService
{
    private readonly IConfiguration _configuration;

    public TokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GenerateAccessToken(AppUser user)
    {   // Claim = Kimlik kartının üzerindeki bilgiler. "Ben şu ID'li, şu email'li, şu rol'deki kullanıcıyım" diyor. Token'ın içine gömülür.
        var claims = new List<Claim> 
          {
              new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
              new Claim(ClaimTypes.Email, user.Email),
              new Claim(ClaimTypes.Name, user.FullName),
              new Claim(ClaimTypes.Role, user.Role?.Name ?? "User")
          };

        //Token'ı imzalamak için gizli bir anahtar. appsettings.json'dan gelecek. Bu anahtar sadece sunucuda olduğu için token taklit edilemez.
        var key = new SymmetricSecurityKey( 
            Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"]!));

        //"Bu anahtarla, HmacSha256 algoritması kullanarak imzala" demek. Mühür basma yöntemi.
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"], // Kim verdi bu token'ı (senin API'n)
            audience: _configuration["Jwt:Audience"], // Kim kullanacak (senin frontend'in)
            claims: claims, // Kullanıcı bilgileri
            expires: DateTime.UtcNow.AddMinutes( // Ne zaman geçersiz olacak
                double.Parse(_configuration["Jwt:ExpiresInMinutes"]!)),
            signingCredentials: credentials  // İmza
        );
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
    public string GenerateRefreshToken()
    {
        var randomBytes = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        return Convert.ToBase64String(randomBytes);
    }
}