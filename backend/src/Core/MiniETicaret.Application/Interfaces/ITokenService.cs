using MiniETicaret.Domain.Entities;
namespace MiniETicaret.Application.Interfaces;

public interface ITokenService
{
    string GenerateAccessToken(AppUser user);
    string GenerateRefreshToken();
}