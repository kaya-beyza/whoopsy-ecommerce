using MiniETicaret.Domain.Common;

namespace MiniETicaret.Domain.Entities;

using MiniETicaret.Domain.Enums;
public class AppUser : BaseEntity
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public string? PhoneNumber { get; set; }
    public string? Address { get; set; }
    public UserGender? Gender { get; set; }
    public DateTime? BirthDate { get; set; }

    // ─── Admin Approval Flow ───
    // Admin başvurularında onaylanana kadar false kalır. Login engellenir.
    public bool IsApproved { get; set; } = true;

    // Başvurunun yaşam döngüsü. Normal kullanıcılar Approved.
    public AdminApprovalStatus ApprovalStatus { get; set; } = AdminApprovalStatus.Approved;

    // Email'deki onay/red linkinin token'ı. Tek kullanımlık.
    public Guid? ApprovalToken { get; set; }

    // Token'ın geçerlilik süresi (24 saat).
    public DateTime? ApprovalTokenExpiresAt { get; set; }

    // Navigation Properties
    public Guid RoleId { get; set; }
    public Role Role { get; set; } = null!;
    public ICollection<Order> Orders { get; set; } = new List<Order>();
    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
    public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
    public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
}
