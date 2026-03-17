using MiniETicaret.Domain.Common;

namespace MiniETicaret.Domain.Entities;

public class RefreshToken : BaseEntity
{
    public string Token { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public bool IsRevoked { get; set; } = false;

    // Navigation Property
    public Guid AppUserId { get; set; }
    public AppUser AppUser { get; set; } = null!;
}